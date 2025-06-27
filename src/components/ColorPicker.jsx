import React, { useState } from 'react';
import { hexToRgb, showMessage } from '../utils/helpers';

const ColorPicker = () => {
    const [selectedColor, setSelectedColor] = useState("#2B77BD");
    const [colorFormat, setColorFormat] = useState("hex");

    const handleCopyColor = () => {
        const colorValue = colorFormat === "hex" ? selectedColor : hexToRgb(selectedColor);
        navigator.clipboard.writeText(colorValue);
        showMessage(`${colorFormat.toUpperCase()} ${colorValue} copied to clipboard!`);
    };

    const containerStyle = {
        marginTop: "30px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
    };

    const selectStyle = {
        border: "2px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        marginLeft: "8px",
    };

    const buttonStyle = {
        marginLeft: "10px",
        padding: "6px 12px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#eee",
        cursor: "pointer",
    };

    return (
        <div style={containerStyle}>
            <label htmlFor="colorPicker" style={{ fontSize: "15px" }}>
                🎨 Pick a Color:
            </label>
            <input
                type="color"
                id="colorPicker"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
            />

            <select
                value={colorFormat}
                onChange={(e) => setColorFormat(e.target.value)}
                style={selectStyle}
            >
                <option value="hex">HEX</option>
                <option value="rgb">RGB</option>
            </select>

            <button onClick={handleCopyColor} style={buttonStyle}>
                📋 Copy {colorFormat.toUpperCase()}
            </button>
        </div>
    );
};

export default ColorPicker;