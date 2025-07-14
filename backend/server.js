import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { findTempFiles } from "./cleanupScanner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5070;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Backend is running. Use GET /cleanup-suggestions and DELETE /delete-temp"
  );
});

app.get("/cleanup-suggestions", (req, res) => {
  const folderPath = req.query.path;
  if (!folderPath)
    return res.status(400).json({ error: "Missing folder path" });

  const absPath = path.resolve(folderPath);
  if (!fs.existsSync(absPath))
    return res.status(400).json({ error: "Folder does not exist" });

  try {
    const tempFiles = findTempFiles(absPath);
    res.json({ folder: absPath, suggestions: tempFiles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/delete-temp", (req, res) => {
  const { paths } = req.body;
  if (!Array.isArray(paths))
    return res.status(400).json({ error: "Expected 'paths' array" });

  const deleted = [];

  for (const p of paths) {
    const abs = path.resolve(p);
    try {
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        fs.rmSync(abs, { recursive: true, force: true });
      } else {
        fs.unlinkSync(abs);
      }
      deleted.push(abs);
    } catch (err) {
      console.warn(`Failed to delete: ${abs}`, err.message);
    }
  }

  res.json({ deleted });
});

app.listen(PORT, () => {
  console.log(`Cleanup API running at http://localhost:${PORT}`);
});
