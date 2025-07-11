import fs from "fs";
import path from "path";

const TEMP_FILE_EXTENSIONS = [".log", ".tmp"];
const TEMP_FOLDER_NAMES = ["__pycache__", ".DS_Store", ".cache", "Thumbs.db"];

export function findTempFiles(dirPath, results = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (TEMP_FOLDER_NAMES.includes(entry.name)) {
        results.push({ type: "folder", name: entry.name, path: fullPath });
      } else {
        findTempFiles(fullPath, results); // recurse
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (TEMP_FILE_EXTENSIONS.includes(ext)) {
        results.push({ type: "file", name: entry.name, path: fullPath });
      }
    }
  }

  return results;
}
