import React, { useState, useEffect } from "react";

import LanguageSelector from './components/LanguageSelector';
import DevTip from './components/DevTip';
import NoteTaker from './components/NoteTaker';
import SavedNotes from './components/SavedNotes';
import JsonValidator from './components/JsonValidator';
import ColorPicker from './components/ColorPicker';
import StackOverflow from './components/StackOverflow';
import ThemeToggle from './components/ThemeToggle';



import { translations } from "./utils/translations.js";
import { showMessage } from "./utils/helpers.js";
import { useLocalStorage } from "./utils/useLocalStorage.js";

const App = () => {
    const [note, setNote] = useState("");
    const [savedNotes, setSavedNotes] = useLocalStorage("my-vscode-notes", []);
    const [warning, setWarning] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("english");

    const handleSave = () => {
        if (note.trim() === "") {
            setWarning("Cannot save an empty note!");
            return;
        }
        const newNote = {
            id: Date.now(),
            content: note,
            pinned: false,
        };
        setSavedNotes((prev) => {
            const pinned = prev.filter((n) => n.pinned);
            const unpinned = prev.filter((n) => !n.pinned);
            return [...pinned, newNote, ...unpinned];
        });
        setNote("");
        setWarning("");
        showMessage("✅ Note Saved!");
    };

    const handleClear = () => {
        setSavedNotes([]);
        setWarning("");
    };

    const togglePin = (id) => {
        setSavedNotes((prev) =>
            prev
                .map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
                .sort((a, b) => b.pinned - a.pinned || b.id - a.id)
        );
    };

    const containerStyle = {
        fontFamily: "sans-serif",
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
        color: darkMode ? "#ffffff" : "#000000",
    };

    const headingStyle = {
        fontSize: "24px",
        marginBottom: "10px",
        textAlign: "center",
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>📝 {translations[language].title}</h2>

            <LanguageSelector
                language={language}
                setLanguage={setLanguage}
                translations={translations}
            />

            <DevTip />

            <NoteTaker
                note={note}
                setNote={setNote}
                onSave={handleSave}
                onClear={handleClear}
                warning={warning}
                darkMode={darkMode}
                language={language}
                translations={translations}
            />

            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

            <SavedNotes
                savedNotes={savedNotes}
                onTogglePin={togglePin}
                darkMode={darkMode}
                language={language}
                translations={translations}
            />

            <JsonValidator darkMode={darkMode} language={language} translations={translations} />

            <ColorPicker />

            <StackOverflow />
        </div>
    );
};

export default App;