import React from 'react';

const SavedNotes = ({ savedNotes, onTogglePin, darkMode, language, translations }) => {
    if (savedNotes.length === 0) return null;

    const containerStyle = {
        marginTop: "20px",
        padding: "10px",
        borderRadius: "6px",
        backgroundColor: darkMode ? "#1e1e1e" : "#fff",
        color: darkMode ? "#fff" : "#000",
        border: darkMode ? "1px solid #555" : "1px solid #ccc",
    };

    const noteItemStyle = {
        padding: "10px 0",
        borderBottom: "1px solid #ddd",
    };

    const noteContentStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
    };

    const pinButtonStyle = (pinned) => ({
        border: "none",
        padding: "6px 12px",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "13px",
        transition: "background-color 0.3s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        backgroundColor: pinned ? "#ffd966" : "#e0e0e0",
    });

    return (
        <div style={containerStyle}>
            <strong>🗒️ {translations[language].saveNote}:</strong>
            {savedNotes.map((note) => (
                <div key={note.id} style={noteItemStyle}>
                    <div style={noteContentStyle}>
                        <p style={{ margin: 0, flex: 1 }}>{note.content}</p>
                        <button
                            onClick={() => onTogglePin(note.id)}
                            style={pinButtonStyle(note.pinned)}
                        >
                            📌 {note.pinned ? "Pinned" : translations[language].pin}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedNotes;