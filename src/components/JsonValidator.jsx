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
      setinput(query);

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
// this style was not looking good
//   const containerStyle = {
//     marginTop: "40px",
//     padding: "25px",
//     backgroundColor: darkMode ? "#1a1a1a" : "rgba(255, 255, 255, 0.1)",
//     border: darkMode
//       ? "1px solid rgba(255, 255, 255, 0.1)"
//       : "1px solid rgba(0,0,0,0.05)",
//     borderRadius: "16px",
//     backdropFilter: "blur(10px)",
//     boxShadow: darkMode
//       ? "0 10px 25px rgba(0,0,0,0.3)"
//       : "0 8px 20px rgba(0, 0, 0, 0.1)",
//   };

  const headingStyle = {
    fontSize: "24px",
    marginBottom: "20px",
    color: darkMode ? "#ffffff" : "#e0b3ff",
    textAlign: "center",
    borderBottom: "2px solid rgba(255,255,255,0.15)",
    paddingBottom: "10px",
  };

  const textAreaStyle = {
    width: "100%",
    height: "150px",
    padding: "15px",
    fontSize: "14px",
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: darkMode ? "#2e2e2e" : "#68338a",
    color: "#fff",
    resize: "vertical",
    outline: "none",
  };

  const buttonContainerStyle = {
    marginTop: "15px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const buttonStyle ={
    backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
    color: "white",
    border: "none",
    padding: "16px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  };

  const validationResultStyle = {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
    color: isJsonValid ? "#00e676" : "#ff5252",
    backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
    border: `2px solid ${isJsonValid ? "#00e676" : "#ff5252"}`,
  };

  const beautifiedContainerStyle = {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
    border: darkMode ? "1px solid #30363d" : "1px solid #e1e4e8",
    borderRadius: "12px",
  };

  const beautifiedHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    paddingBottom: "10px",
  };

  const preStyle = {
    padding: "20px",
    borderRadius: "10px",
    fontSize: "15px",
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    overflow: "auto",
    minHeight: "400px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    margin: 0,
    backgroundColor:darkMode ? "#2a2a2a" : "#68338a" ,
    color:  "#e6edf3",
    border: darkMode ? "1px solid #30363d" : "1px solid #e1e4e8",
  };

  const inputkastyle = {
    width: "90%",
    padding: "16px",
    borderRadius: "8px 0px 0px 8px",
    backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
    border: "none",
    color: "#fff",
    fontSize: "14px",
    marginBottom: "10px",
    outline: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  };
  const inputkabutton = {
    backgroundColor: darkMode ? "#2a2a2a" : "#68338a",
    color: "white",
    border: "none",
    padding: "16px 16px",
    borderRadius: "0px 8px 8px 0px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    // transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  };

    return (
        //   containerStyle ye style name neeche wale div ka hai 
        
    <div>
      <h3 style={headingStyle}>{translations[language].jsonValidator}</h3>
      {/* api input ke liye */}
      <div style={{ marginBottom: "20px" }}>
        <input
          className="purple-placeholder"
          type="text"
          placeholder="Enter API URL here"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          style={inputkastyle}
        />
        <button onClick={testApiManually} style={inputkabutton}>
          Test API
        </button>
      </div>

      <textarea
        className="purple-placeholder"
        placeholder={translations[language].jsonPlaceholder}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        style={textAreaStyle}
      />

      <div style={buttonContainerStyle}>
        <button onClick={validateJson} style={buttonStyle}>
          {translations[language].validateButton}
        </button>
        <button onClick={beautifyJson} style={buttonStyle}>
          {translations[language].beautifyButton}
        </button>
        <button onClick={clearJson} style={buttonStyle}>
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
                color: "#ffffff",
                fontSize: "16px",
              }}
            >
              {translations[language].beautifiedJson}
            </h4>
            <button onClick={copyBeautifiedJson} style={buttonStyle}>
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
