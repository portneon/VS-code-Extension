import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { TextSearch } from "lucide-react";

const SavedNotes = ({
  savedNotes,
  onTogglePin,
  onRenameNote,
  onDeleteNote,
  onEditNoteContent,
  darkMode,
  searchquery = "", //starting me undefined rahe se issue aa sakta hai because we are using "startswith()"
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const menuRefs = useRef({});
  const renameRef = useRef(null);

  // Handle click outside for menu
  useEffect(() => {
    const handler = (e) => {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [openMenuId]);

  // Handle click outside for title rename
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        editingTitleId &&
        renameRef.current &&
        !renameRef.current.contains(e.target)
      ) {
        setEditingTitleId(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [editingTitleId]);

  // Update query from searchquery prop
  useEffect(() => {
    const cleanedQuery = searchquery.startsWith("@notes")
      ? searchquery.replace("@notes", "").trim()
      : searchquery.trim();
    setQuery(cleanedQuery);
  }, [searchquery]);

  // Filter suggestions
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    const matches = savedNotes
      .filter((note) => note.title?.toLowerCase().includes(query.toLowerCase()))
      .map((note) => note.title);
    setSuggestions(matches.slice(0, 5));
  }, [query, savedNotes]);

  const handleTitleRename = (id) => {
    if (newTitle.trim()) {
      onRenameNote(id, newTitle.trim());
    }
    setEditingTitleId(null);
  };

  const downloadAsPdf = (content, title) => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, 10);
    doc.save(`${title || "note"}.pdf`);
  };

  const downloadAsTxt = (content, title) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ marginBottom: "15px", position: "relative" }}>
        <input
          className="purple-placeholder"
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            height: "50px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            backgroundColor: darkMode ? "#1e1e1e" : "#68338a",
            color: "#eee",
            border: "1px solid white",
            outline: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextSearch size={20} />
        </span>
        {suggestions.length > 0 && (
          <ul
            style={{
              background: darkMode ? "#222" : "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "4px",
              maxWidth: "400px",
              listStyle: "none",
              padding: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              position: "absolute",
              zIndex: 100,
            }}
          >
            {suggestions.map((s, i) => (
              <li
                key={i}
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
                onClick={() => setQuery(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Inline Edit Panel */}
      {editingNoteId && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            margin: "20px 0",
            width: "100%",
            background: darkMode ? "#1e1e1e" : "#68338a",
            color: darkMode ? "#fff" : "#fff",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            border: darkMode ? "1px solid #333" : "1px solid #ccc",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            minWidth: "100%",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Edit Note</h3>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              width: "100%",
              minHeight: "700px",
              maxHeight: "794px",
              overflowY: "auto",
              resize: "vertical",
              fontSize: "16px",
              padding: "10px",
              background: darkMode ? "#1e1e1e" : "#f1e4ff",
              color: darkMode ? "#fff" : "#000",
              border: "1px solid #aaa",
              borderRadius: "6px",
              fontFamily: "monospace",
              boxSizing: "border-box",
            }}
          />

          <div style={{ marginTop: "15px", textAlign: "right" }}>
            <button
              onClick={() => {
                onEditNoteContent(editingNoteId, editedContent);
                setEditingNoteId(null);
              }}
              style={{
                padding: "8px 16px",
                marginRight: "10px",
                background: "#00008B",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditingNoteId(null)}
              style={{
                padding: "8px 16px",
                background: "#600763",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {savedNotes
          .filter(
            (note) =>
              note.title?.toLowerCase().includes(query.toLowerCase()) ||
              note.content?.toLowerCase().includes(query.toLowerCase())
          )
          .map((note) => (
            <div
              key={note.id}
              style={{
                position: "relative",
                height: "220px",
                padding: "15px",
                borderRadius: "10px",
                backgroundColor: darkMode ? "#1e1e1e" : "#68338a",
                color: "#eee",
                border: darkMode ? "1px solid #333" : "1px solid #ccc",
                boxShadow: darkMode
                  ? "0 2px 6px rgba(255,255,255,0.05)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              onClick={() => {
                setEditingNoteId(note.id);
                setEditedContent(note.content);
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: note.pinned ? "#ffd700" : darkMode ? "#888" : "#555",
                }}
                onClick={() => onTogglePin(note.id)}
              >
                {note.pinned ? "⭐" : "☆"}
              </span>

              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "none",
                  border: "none",
                  color: "#ccc",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === note.id ? null : note.id);
                }}
              >
                ⋮
              </button>

              {openMenuId === note.id && (
                <div
                  style={{
                    position: "absolute",
                    background: darkMode ? "#333" : "#f9f9f9",
                    border: "1px solid #aaa",
                    borderRadius: "6px",
                    padding: "5px 0",
                    zIndex: 100,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                  ref={(el) => (menuRefs.current[note.id] = el)}
                >
                  <div
                    style={{
                      padding: "8px 15px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      color: darkMode ? "#eee" : "#000",
                    }}
                    onClick={() => {
                      setEditingTitleId(note.id);
                      setNewTitle(note.title);
                      setOpenMenuId(null);
                    }}
                  >
                    Rename
                  </div>
                  <div
                    style={{
                      padding: "8px 15px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      color: darkMode ? "#eee" : "#000",
                    }}
                    onClick={() => downloadAsPdf(note.content, note.title)}
                  >
                    Download PDF
                  </div>
                  <div
                    style={{
                      padding: "8px 15px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      color: darkMode ? "#eee" : "#000",
                    }}
                    onClick={() => downloadAsTxt(note.content, note.title)}
                  >
                    Download TXT
                  </div>
                  <div
                    style={{
                      padding: "8px 15px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      color: darkMode ? "#eee" : "#000",
                    }}
                    onClick={() => onDeleteNote(note.id)}
                  >
                    Delete
                  </div>
                </div>
              )}

              <div
                style={{
                  flexGrow: 1,
                  whiteSpace: "pre-wrap",
                  overflowY: "auto",
                  paddingTop: "20px",
                  paddingLeft: "5px",
                }}
              >
                {note.content}
              </div>

              <div
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  paddingTop: "5px",
                  cursor: "pointer",
                }}
                onDoubleClick={() => {
                  setEditingTitleId(note.id);
                  setNewTitle(note.title);
                }}
              >
                {editingTitleId === note.id ? (
                  <div ref={renameRef}>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleTitleRename(note.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleTitleRename(note.id);
                        if (e.key === "Escape") setEditingTitleId(null);
                      }}
                      autoFocus
                      style={{
                        width: "80%",
                        padding: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                ) : (
                  note.title
                )}
              </div>
            </div>
          ))}
      </div>
      {editingNoteId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setEditingNoteId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: "700px",
              height: "80vh",
              background: darkMode ? "#1e1e1e" : "#fff",
              color: darkMode ? "#fff" : "#000",
              padding: "20px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Edit Note</h3>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{
                flexGrow: 1,
                resize: "none",
                fontSize: "16px",
                padding: "10px",
                background: darkMode ? "#333" : "#f0f0f0",
                color: darkMode ? "#fff" : "#000",
                border: "1px solid #aaa",
                borderRadius: "6px",
              }}
            />
            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button
                onClick={() => {
                  onEditNoteContent(editingNoteId, editedContent);
                  setEditingNoteId(null);
                }}
                style={{
                  padding: "8px 16px",
                  marginRight: "10px",
                  background: "#4caf50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditingNoteId(null)}
                style={{
                  padding: "8px 16px",
                  background: "#999",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SavedNotes;
