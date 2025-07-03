import React, { useState, useEffect } from "react";

const ConnectionStatus = ({ darkMode = false }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const containerStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
    borderRadius: "50%",
    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    cursor: "default",
    position: "relative",
  };

  const dotStyle = {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: isOnline ? "#22c55e" : "#ef4444",
    boxShadow: isOnline
      ? "0 0 8px rgba(34, 197, 94, 0.4), 0 0 4px rgba(34, 197, 94, 0.6)"
      : "0 0 8px rgba(239, 68, 68, 0.4), 0 0 4px rgba(239, 68, 68, 0.6)",
    transition: "all 0.3s ease",
    animation: isOnline ? "pulse 2s infinite" : "none",
  };

  const tooltipStyle = {
    position: "absolute",
    bottom: "-35px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: darkMode ? "#2a2a2a" : "#333",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    zIndex: 10000,
    opacity: showTooltip ? 1 : 0,
    visibility: showTooltip ? "visible" : "hidden",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  };

  const tooltipArrowStyle = {
    position: "absolute",
    top: "-4px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "4px solid transparent",
    borderRight: "4px solid transparent",
    borderBottom: `4px solid ${darkMode ? "#2a2a2a" : "#333"}`,
  };

  const pulseKeyframes = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;

  return (
    <>
      <style>{pulseKeyframes}</style>
      <div
        style={containerStyle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div style={dotStyle}></div>
        <div style={tooltipStyle}>
          <div style={tooltipArrowStyle}></div>
          {isOnline ? "Connected to Internet" : "No Internet Connection"}
        </div>
      </div>
    </>
  );
};

export default ConnectionStatus;