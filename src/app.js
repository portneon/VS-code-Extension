import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";


const App = () => {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("my-vscode-note");
    if (saved) {
      setSavedNote(saved);
      setNote("");
    }
  }, []);

  const handleSave = () => {
    if (note.trim() === "") {
      setWarning("Cannot Save empty note!");
      return;
    }

    setWarning("");
    localStorage.setItem("my-vscode-note", note);
    setSavedNote(note);
    alert("✅ Note Saved!"); 
    setNote("");
  };

  const handleClear = () => {
    localStorage.removeItem("my-vscode-note");
    setNote("");
    setSavedNote("");
    setWarning("");
  };
  const Downloadnotes = (format) => {
    const file = `note_${new Date().toISOString().slice(0, 19)}.${format}`;
    if (format == "pdf") {
      const doc = new jsPDF()
      const lines = doc.splitTextToSize(savedNote, 180);
      doc.text(lines, 10, 10)
      doc.save(file)
    } else {
      const blob = new Blob([savedNote], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob)
      link.download = file
      link.click()
      
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 VS Code Notes</h2>
      <textarea
        placeholder="Write your thoughts..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={styles.textarea}
      ></textarea>
      <div style={styles.buttonContainer}>
        <button onClick={handleSave} style={styles.saveBtn}>
          💾 Save Note
        </button>
        <button onClick={handleClear} style={styles.clearBtn}>
          🧹 Clear
        </button>
      </div>

      {warning && <div style={styles.warning}>{warning}</div>}

      {savedNote && (
        <div style={styles.saved}>
          <strong>🗒️ Saved Note:</strong>
          <p>{savedNote}</p>
          <button onClick={() => Downloadnotes("txt")}>Download as .txt</button>
          <button onClick={() => Downloadnotes("md")}>Download as .md</button>
          <button onClick={() => Downloadnotes("pdf")}>Download as .pdf</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "sans-serif",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  buttonContainer: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  clearBtn: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  saved: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  warning: {
    color: "#cc3300",
    margin: "30px 30px",
    fontWeight: "bold",
    fontSize: "20px",
  },
};

export default App;
