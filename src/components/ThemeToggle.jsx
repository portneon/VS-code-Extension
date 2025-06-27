import React from 'react';

const ThemeToggle = ({ darkMode, setDarkMode }) => {
    const buttonStyle = {
        border: "none",
        padding: "10px 15px",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: darkMode ? "#333" : "#eee",
        color: darkMode ? "#fff" : "#000",
        marginTop: "10px",
    };

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            style={buttonStyle}
        >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
};

export default ThemeToggle;