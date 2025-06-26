import React from 'react';

const LanguageSelector = ({ language, setLanguage, translations }) => {
    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        marginBottom: "10px",
    };

    const selectStyle = {
        border: "2px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        marginLeft: "8px",
    };

    return (
        <div style={containerStyle}>
            <h3>{translations[language].languageLabel}</h3>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={selectStyle}
            >
                <option value="english">English</option>
                <option value="hindi">हिन्दी</option>
                <option value="spanish">Española</option>
            </select>
        </div>
    );
};

export default LanguageSelector;