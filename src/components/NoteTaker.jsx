import React from "react";

const NoteTaker = ({
  note,
  setNote,
  onSave,
  onClear,
  warning,
  darkMode,
  language,
  translations,
}) => {
  const textAreaStyle = {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    resize: "vertical",
    fontFamily: "monospace",
    backgroundColor: darkMode ? "#1e1e1e" : "#fff",
    color: darkMode ? "#fff" : "#000",
    border: darkMode ? "1px solid #555" : "1px solid #ccc",
  };

  const buttonContainerStyle = {
    marginTop: "10px",
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const saveButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const clearButtonStyle = {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const warningStyle = {
    color: "#cc3300",
    margin: "30px 0",
    fontWeight: "bold",
    fontSize: "18px",
  };

  return (
    <div>
      <textarea
        placeholder={translations[language].placeholder}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={textAreaStyle}
      />

      <div style={buttonContainerStyle}>
        <button onClick={onSave} style={saveButtonStyle}>
          {translations[language].saveButton}
        </button>
        <button onClick={onClear} style={clearButtonStyle}>
          {translations[language].clearButton}
        </button>
      </div>

      {warning && <div style={warningStyle}>{warning}</div>}
    </div>
  );
};

export default NoteTaker;
