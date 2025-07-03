import React, { useEffect, useState } from "react";

const vscode = acquireVsCodeApi();

const TreeView = () => {
  const [tree, setTree] = useState([]);
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    const handleMessage = (event) => {
      const message = event.data;
      if (message.type === "treeData") {
        setTree(message.tree);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const toggleExpand = (path) => {
    const newSet = new Set(expanded);
    newSet.has(path) ? newSet.delete(path) : newSet.add(path);
    setExpanded(newSet);
  };

  const copyPath = (path) => {
    navigator.clipboard.writeText(path);
    vscode.postMessage({ command: "alert", text: `📋 Copied: ${path}` });
  };

  const renderTree = (nodes, depth = 0, isLastList = []) => {
    return (
      <div style={{ marginLeft: depth * 16, position: "relative" }}>
        {nodes.map((node, index) => {
          const isOpen = expanded.has(node.path);
          const isLast = index === nodes.length - 1;

          return (
            <div key={node.path} style={{ position: "relative" }}>
              {/* Vertical Line */}
              {depth > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: -12,
                    width: "12px",
                    height: "100%",
                    borderLeft: isLastList[depth - 1] ? "none" : "1px solid #ccc",
                    animation: "drawLine 0.5s ease-in-out",
                  }}
                />
              )}

              {/* Tree Node */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#888", fontFamily: "monospace", marginRight: 4 }}>
                  {depth > 0 ? (isLast ? "└──" : "├──") : ""}
                </span>

                <span
                  onClick={() =>
                    node.isDirectory ? toggleExpand(node.path) : copyPath(node.path)
                  }
                  style={{
                    cursor: "pointer",
                    color: node.isDirectory ? "#4FC3F7" : "white",
                    fontWeight: node.isDirectory ? "bold" : "normal",
                    fontFamily: "monospace",
                    transition: "color 0.2s ease",
                  }}
                >
                  {node.isDirectory ? (isOpen ? "📂" : "📁") : "📄"} {node.name}
                </span>
              </div>

              {/* Child Nodes */}
              {node.children && isOpen && (
                <div
                  style={{
                    marginLeft: 16,
                    overflow: "hidden",
                    animation: "expandTree 0.3s ease-in-out",
                  }}
                >
                  {renderTree(node.children, depth + 1, [...isLastList, isLast])}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app-content">
      <div
        className="tool-container"
        style={{
          padding: "20px",
          color: "white",
          fontFamily: "'Courier New', monospace",
          fontSize: "14px",
        }}
      >
        <style>
          {`
            @keyframes drawLine {
              from { height: 0; }
              to { height: 100%; }
            }
  
            @keyframes expandTree {
              0% {
                opacity: 0;
                transform: translateY(-5px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
  
        <h3 style={{ color: "#90CAF9", marginBottom: "12px" }}>📁 Folder Tree</h3>
        {tree.length > 0 ? renderTree(tree) : <p>Loading tree...</p>}
      </div>
    </div>
  );
  
};

export default TreeView;