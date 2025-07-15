import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

// Helper functions
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` :
        hex;
};

const showMessage = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(28, 4, 38, 0.95);
        backdrop-filter: blur(20px);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif;
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        animation: toastSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 350px;
        word-wrap: break-word;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastSlideIn {
            from {
                opacity: 0;
                transform: translateX(100%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }
        @keyframes toastSlideOut {
            from {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateX(100%) scale(0.8);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-in-out';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 300);
    }, 2700);
};

const ColorPicker = () => {
    const [selectedColor, setSelectedColor] = useState("#2B77BD");
    const [colorFormat, setColorFormat] = useState("hex");
    const [showPicker, setShowPicker] = useState(false);

    const handleCopyColor = () => {
        let colorValue;
        switch (colorFormat) {
            case "rgb":
                colorValue = hexToRgb(selectedColor);
                break;
            default:
                colorValue = selectedColor;
        }
        navigator.clipboard.writeText(colorValue);
        showMessage(`${colorFormat.toUpperCase()} ${colorValue} copied to clipboard!`);
    };

    const getColorValue = () => {
        switch (colorFormat) {
            case "rgb":
                return hexToRgb(selectedColor);
            default:
                return selectedColor;
        }
    };

    const containerStyle = {
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: "16px",
        padding: "32px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        maxWidth: "480px",
        margin: "20px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
    };

    const titleStyle = {
        fontSize: "24px",
        fontWeight: "700",
        marginBottom: "32px",
        color: "#2c3e50",
        textAlign: "center",
        letterSpacing: "-0.5px",
    };

    const pickerSectionStyle = {
        marginBottom: "24px",
    };

    const customColorBoxStyle = {
        position: "relative",
        width: "100%",
        height: "80px",
        backgroundColor: selectedColor,
        borderRadius: "12px",
        border: "4px solid #fff",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 2px 8px rgba(255, 255, 255, 0.2)",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "16px",
    };

    const colorBoxTextStyle = {
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        opacity: showPicker ? 0 : 1,
        transition: "opacity 0.2s ease",
    };

    const pickerContainerStyle = {
        position: "absolute",
        top: "100%",
        left: "0",
        right: "0",
        zIndex: 10,
        marginTop: "8px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        opacity: showPicker ? 1 : 0,
        transform: showPicker ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: showPicker ? "auto" : "none",
    };

    const controlsStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "24px",
        flexWrap: "wrap",
    };

    const selectStyle = {
        border: "2px solid #e1e8ed",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "14px",
        backgroundColor: "#fff",
        cursor: "pointer",
        outline: "none",
        transition: "all 0.2s ease",
        minWidth: "100px",
        fontWeight: "500",
    };

    const buttonStyle = {
        padding: "12px 24px",
        borderRadius: "10px",
        border: "none",
        background: `linear-gradient(135deg, ${selectedColor} 0%, ${selectedColor}dd 100%)`,
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        minWidth: "140px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    };

    const previewStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05), 0 4px 16px rgba(0, 0, 0, 0.1)",
    };

    const colorValueStyle = {
        fontSize: "16px",
        fontWeight: "600",
        color: "#2c3e50",
        fontFamily: "monospace",
        backgroundColor: "#f8f9fa",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #e9ecef",
    };

    const colorSwatchStyle = {
        width: "50px",
        height: "50px",
        backgroundColor: selectedColor,
        borderRadius: "50%",
        border: "4px solid #fff",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
    };

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>Color Picker</div>

            <div style={pickerSectionStyle}>
                <div style={{ position: "relative" }}>
                    <div
                        style={customColorBoxStyle}
                        onClick={() => setShowPicker(!showPicker)}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.02)";
                            e.target.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 2px 8px rgba(255, 255, 255, 0.2)";
                        }}
                    >
                        <div style={colorBoxTextStyle}>
                            {showPicker ? "" : "Click to pick color"}
                        </div>
                    </div>

                    <div style={pickerContainerStyle}>
                        <HexColorPicker
                            color={selectedColor}
                            onChange={setSelectedColor}
                            style={{
                                width: "100%",
                                height: "200px",
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={controlsStyle}>
                <select
                    value={colorFormat}
                    onChange={(e) => setColorFormat(e.target.value)}
                    style={selectStyle}
                    onFocus={(e) => e.target.style.borderColor = selectedColor}
                    onBlur={(e) => e.target.style.borderColor = "#e1e8ed"}
                >
                    <option value="hex">HEX</option>
                    <option value="rgb">RGB</option>
                </select>

                <button
                    onClick={handleCopyColor}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
                    }}
                >
                    Copy {colorFormat.toUpperCase()}
                </button>
            </div>

            <div style={previewStyle}>
                <div>
                    <div style={{ fontSize: "12px", color: "#7f8c8d", marginBottom: "8px", fontWeight: "500" }}>
                        Selected Color:
                    </div>
                    <div style={colorValueStyle}>
                        {getColorValue()}
                    </div>
                </div>
                <div style={colorSwatchStyle}></div>
            </div>
        </div>
    );
};

export default ColorPicker;