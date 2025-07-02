import React, { useState, useEffect } from "react";

const ConnectionStatus = ({ darkMode = false }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const styles = {
    container: {
      position: "absolute",
      top: 20,
      right: 20,
      backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
      border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: darkMode
        ? "0 2px 8px rgba(255,255,255,0.05)"
        : "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      zIndex: 9999,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: isOnline ? "#28a745" : "#dc3545",
    },
    text: {
      fontSize: 14,
      fontWeight: "500",
      color: darkMode ? "#f0f0f0" : "#333",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.dot}></div>
      <span style={styles.text}>{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
};

export default ConnectionStatus;
