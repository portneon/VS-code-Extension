import React, { useState, useEffect } from "react";
import { getRandomTip } from "../utils/helpers";

const DevTip = () => {
  const [devTip, setDevTip] = useState("");

  useEffect(() => {
    setDevTip(getRandomTip());
  }, []);

  const containerStyle = {
    textAlign: "center",
    padding: "24px 32px",
    fontSize: "16px",
    fontWeight: "500",
    background: "linear-gradient(90deg, #1F2937 0%, #374151 100%)",
    border: "1px solid rgba(255, 255, 0.1)",
    borderRadius: "12px",
    margin: "32px 0",
    color: "#F9FAFB",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  };

  const headingStyle = {
    fontFamily: "'Inter', -apple-system, Roboto, sans-serif",
    fontSize: "1.25rem",
    fontWeight: "700",
    letterSpacing: "0.1px",
    color: "#FFFFFF",
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>dev TIPS</h3>
      <p style={{ textAlign: "center" }}>{devTip}</p>
    </div>
  );
};

export default DevTip;
