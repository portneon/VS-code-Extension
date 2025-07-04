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
  return (
    <div className="tool-container">
      <textarea
        className="note-textarea"
        placeholder={translations[language].placeholder}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="note-buttons">
        <button className="note-button save" onClick={onSave}>
          💾 {translations[language].saveButton}
        </button>
        <button className="note-button clear" onClick={onClear}>
          🧹 {translations[language].clearButton}
        </button>
      </div>

      {warning && <div className="note-warning">{warning}</div>}
    </div>
  );
};

export default NoteTaker;
