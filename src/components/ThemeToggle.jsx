import React from "react";

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  const buttonStyle = {
    position: "absolute",
    left: "20px",
    top: "90px",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: darkMode ? "#333" : "#eee",
    color: darkMode ? "#fff" : "#000",
    display: "block",
    margin: "10px auto 0 auto",
  };

  return (
    <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle}>
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
