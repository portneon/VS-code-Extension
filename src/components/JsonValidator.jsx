import React, { useEffect, useState } from "react";
import { showMessage } from "../utils/helpers";

const JsonValidator = ({ query, darkMode, language, translations }) => {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonValidationResult, setJsonValidationResult] = useState("");
  const [beautifiedJson, setBeautifiedJson] = useState("");
  const [isJsonValid, setIsJsonValid] = useState(null);
  const [input, setinput] = useState("");

  useEffect(() => {
    const fetchFromQueryUrl = async () => {
        if (!query || !query.trim()) return;
        setinput(query)

      try {
        const response = await fetch(query);
        const data = await response.json();
        const formatted = JSON.stringify(data, null, 2);

        setBeautifiedJson(formatted);
        setJsonInput(formatted);
        setIsJsonValid(true);
        setJsonValidationResult(translations[language].validJson);
      } catch (error) {
        setBeautifiedJson("");
        setJsonInput("");
        setIsJsonValid(false);
        setJsonValidationResult(
          `${translations[language].invalidJson} ${error.message}`
        );
      }
    };

    fetchFromQueryUrl();
  }, [query]);

  const validateJson = () => {
    if (!jsonInput.trim()) {
      setJsonValidationResult("Please enter some JSON to validate.");
      setIsJsonValid(false);
      return;
    }

    try {
      JSON.parse(jsonInput);
      setJsonValidationResult(translations[language].validJson);
      setIsJsonValid(true);
    } catch (error) {
      setJsonValidationResult(
        `${translations[language].invalidJson} ${error.message}`
      );
      setIsJsonValid(false);
    }
  };

  const beautifyJson = () => {
    if (!jsonInput.trim()) {
      setBeautifiedJson("Please enter some JSON to beautify.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setBeautifiedJson(formatted);
      setJsonValidationResult(translations[language].validJson);
      setIsJsonValid(true);
    } catch (error) {
      setBeautifiedJson(`Error: ${error.message}`);
      setJsonValidationResult(
        `${translations[language].invalidJson} ${error.message}`
      );
      setIsJsonValid(false);
    }
  };

  const clearJson = () => {
    setJsonInput("");
    setJsonValidationResult("");
    setBeautifiedJson("");
    setIsJsonValid(null);
  };

  // yaha se start ho raha hai
  const testApiManually = async () => {
    if (!input.trim()) {
      setJsonValidationResult("Please enter a valid API URL.");
      setIsJsonValid(false);
      return;
    }

    try {
      const response = await fetch(input);
      const data = await response.json();
      const formatted = JSON.stringify(data, null, 2);

      setBeautifiedJson(formatted);
      setJsonInput(formatted);
      setIsJsonValid(true);
      setJsonValidationResult(translations[language].validJson);
    } catch (error) {
      setBeautifiedJson("");
      setJsonInput("");
      setIsJsonValid(false);
      setJsonValidationResult(
        `${translations[language].invalidJson} ${error.message}`
      );
    }
  };

  // yaha khatam ho raha

  const copyBeautifiedJson = () => {
    if (beautifiedJson && isJsonValid) {
      navigator.clipboard.writeText(beautifiedJson);
      showMessage("JSON copied to clipboard!");
    }
  };

  const containerStyle = {
    marginTop: "40px",
    padding: "25px",
    backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
    border: darkMode ? "2px solid #555" : "2px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const headingStyle = {
    fontSize: "20px",
    marginBottom: "20px",
    color: darkMode ? "#ffffff" : "#2B77BD",
    textAlign: "center",
    borderBottom: darkMode ? "2px solid #555" : "2px solid #ddd",
    paddingBottom: "10px",
  };

  const textAreaStyle = {
    width: "100%",
    height: "150px",
    padding: "15px",
    fontSize: "14px",
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    borderRadius: "8px",
    border: darkMode ? "2px solid #555" : "2px solid #ccc",
    backgroundColor: darkMode ? "#2a2a2a" : "#fff",
    color: darkMode ? "#fff" : "#000",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonContainerStyle = {
    marginTop: "15px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  });

  const validationResultStyle = {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
    color: isJsonValid ? "#4CAF50" : "#f44336",
    backgroundColor: darkMode ? "#2a2a2a" : "#f9f9f9",
    border: `2px solid ${isJsonValid ? "#4CAF50" : "#f44336"}`,
  };

  const beautifiedContainerStyle = {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: darkMode ? "#2a2a2a" : "#f8f9fa",
    border: darkMode ? "2px solid #555" : "2px solid #ddd",
    borderRadius: "8px",
  };

  const beautifiedHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    borderBottom: darkMode ? "1px solid #555" : "1px solid #ddd",
    paddingBottom: "10px",
  };

  const preStyle = {
    padding: "20px",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    overflow: "auto",
    maxHeight: "400px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    margin: 0,
    backgroundColor: darkMode ? "#0d1117" : "#ffffff",
    color: darkMode ? "#e6edf3" : "#24292f",
    border: darkMode ? "1px solid #30363d" : "1px solid #e1e4e8",
  };
    const inputkastyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: darkMode ? "2px solid #555" : "2px solid #ccc",
        backgroundColor: darkMode ? "#2a2a2a" : "#fff",
        color: darkMode ? "#fff" : "#000",
        fontSize: "14px",
        marginBottom: "10px",
      }

  return (
    <div style={containerStyle}>
          <h3 style={headingStyle}>{translations[language].jsonValidator}</h3>
          {/* api input ke liye */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter API URL here"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          style={inputkastyle}
        />
        <button onClick={testApiManually} style={buttonStyle("#9C27B0")}>
          Test API
        </button>
      </div>

      <textarea
        placeholder={translations[language].jsonPlaceholder}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        style={textAreaStyle}
      />

      <div style={buttonContainerStyle}>
        <button onClick={validateJson} style={buttonStyle("#2196F3")}>
          {translations[language].validateButton}
        </button>
        <button onClick={beautifyJson} style={buttonStyle("#FF9800")}>
          {translations[language].beautifyButton}
        </button>
        <button onClick={clearJson} style={buttonStyle("#f44336")}>
          {translations[language].clearJsonButton}
        </button>
      </div>

      {jsonValidationResult && (
        <div style={validationResultStyle}>{jsonValidationResult}</div>
      )}

      {beautifiedJson && isJsonValid && (
        <div style={beautifiedContainerStyle}>
          <div style={beautifiedHeaderStyle}>
            <h4
              style={{
                margin: 0,
                color: darkMode ? "#ffffff" : "#333",
                fontSize: "16px",
              }}
            >
              {translations[language].beautifiedJson}
            </h4>
            <button onClick={copyBeautifiedJson} style={buttonStyle("#4CAF50")}>
              {translations[language].copyJsonButton}
            </button>
          </div>
          <pre style={preStyle}>{beautifiedJson}</pre>
        </div>
      )}
    </div>
  );
};

export default JsonValidator;
