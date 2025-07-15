import React, { useState } from "react";
import axios from "axios";
import { CircleCheck } from "lucide-react";

export default function CleanupTool({ darkMode }) {
  const [folderPath, setFolderPath] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);

  const fetchSuggestions = async () => {
    if (!folderPath) {
      setError("Please enter a folder path.");
      return;
    }

    setError("");
    setSuggestions([]);
    setDeleted([]);
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:5070/cleanup-suggestions", {
        params: { path: folderPath },
      });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch suggestions.");
    }

    setLoading(false);
  };

  const deleteSelected = async () => {
    setDeleting(true);
    try {
      const res = await axios.delete("http://localhost:5070/delete-temp", {
        data: { paths: suggestions.map((s) => s.path) },
      });
      setDeleted(res.data.deleted);
      setSuggestions([]);
    } catch (err) {
      setError(err.response?.data?.error || "Deletion failed.");
    }
    setDeleting(false);
  };

  const styles = {
    heading: {
      fontSize: "24px",
      marginBottom: "18px",
      color: "#e0b3ff",
      textAlign: "center",
      borderBottom: "2px solid rgba(255,255,255,0.15)",
      paddingBottom: "10px",
      fontWeight: 700,
    },
    input: {
      backgroundColor: darkMode ? "#2e2e2e" : "#68338a",
      padding: "14px 18px",
      fontSize: 16,
      width: "calc(100% - 160px)",
      borderRadius: 8,
    },
    buttonPrimary: {
      padding: "14px 28px",
      marginLeft: 15,
      backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
      color: "white",
      fontWeight: "600",
      fontSize: 16,
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      userSelect: "none",
    },
    buttonPrimaryDisabled: {
      backgroundColor: "#a5b4fc",
      cursor: "not-allowed",
      boxShadow: "none",
    },
    buttonDanger: {
      padding: "14px 32px",
      backgroundColor: "#dc3545",
      color: "white",
      fontWeight: "600",
      fontSize: 16,
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.1s",
      userSelect: "none",
      boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
      marginTop: 20,
    },
    buttonDangerDisabled: {
      backgroundColor: "#f1aeb5",
      cursor: "not-allowed",
      boxShadow: "none",
    },
    errorText: {
      color: "#dc3545",
      marginTop: 15,
      fontWeight: "600",
      backgroundColor: "rgba(220, 53, 69, 0.1)",
      padding: "8px 12px",
      borderRadius: 4,
    },
    listContainer: {
      marginTop: 30,
      paddingLeft: 0,
      listStyle: "none",
      maxHeight: 280,
      overflowY: "auto",
      border: "1px solid #e9ecef",
      borderRadius: 8,
      backgroundColor: "#f8f4ff",
      boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "14px 20px",
      borderBottom: "1px solid #eee",
      fontSize: 16,
      color: "#2d1b4d",
      userSelect: "none",
      transition: "background-color 0.2s",
    },
    listItemPath: {
      color: "#6c757d",
      fontSize: 13,
      fontStyle: "italic",
      marginLeft: 10,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "60%",
    },
    deletedItem: {
      color: "#28a745",
      fontWeight: "600",
      marginBottom: 6,
      fontSize: 15,
      userSelect: "none",
      backgroundColor: "rgba(40, 167, 69, 0.1)",
      padding: "6px 10px",
      borderRadius: 4,
    },
    sectionHeading: {
      fontWeight: "700",
      fontSize: "1.5rem",
      color: "#4a2c6d",
      userSelect: "none",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
  };

  return (
    <div>
      <h1 style={styles.heading}>Folder Cleanup Tool</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <input
          type="text"
          placeholder="Enter full folder path"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          style={styles.input}
        />
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          style={{
            ...styles.buttonPrimary,
            ...(loading ? styles.buttonPrimaryDisabled : {}),
          }}
          aria-label="Get cleanup suggestions"
        >
          {loading ? "Scanning..." : "Get Cleanup Suggestions"}
        </button>
      </div>

      {error && <p style={styles.errorText}>❌ {error}</p>}

      {suggestions.length > 0 && (
        <>
          <h2 style={styles.sectionHeading}>Suggested for Deletion</h2>
          <ul style={styles.listContainer}>
            {suggestions.map((item, idx) => (
              <li key={idx} style={styles.listItem} title={item.path}>
                <span>
                  {item.type === "folder" ? "📁" : "📄"} {item.name}
                </span>
                <span style={styles.listItemPath}>{item.path}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={deleteSelected}
            disabled={deleting}
            style={{
              ...styles.buttonDanger,
              ...(deleting ? styles.buttonDangerDisabled : {}),
            }}
            aria-label="Delete all suggested files and folders"
          >
            {deleting ? "Deleting..." : "Delete All"}
          </button>
        </>
      )}

      {deleted.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
              lineHeight: 1,
            }}
          >
            <CircleCheck size={24} color="#28a745" style={{ flexShrink: 0 }} />
            <span
              style={{
                ...styles.sectionHeading,
                margin: 0,
                padding: 0,
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              Deleted:
            </span>
          </div>

          <ul style={{ paddingLeft: 20 }}>
            {deleted.map((p, idx) => (
              <li key={idx} style={styles.deletedItem} title={p}>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
