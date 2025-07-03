import React, { useState } from "react";
import {
  Search,
  StickyNote,
  FileText,
  ExternalLink,
  Sun,
  Moon,
  Languages,
} from "lucide-react";

import LanguageSelector from "./components/LanguageSelector";
import DevTip from "./components/DevTip";
import NoteTaker from "./components/NoteTaker";
import SavedNotes from "./components/SavedNotes";
import JsonValidator from "./components/JsonValidator";
import ColorPicker from "./components/ColorPicker";
import StackOverflow from "./components/StackOverflow";
import ThemeToggle from "./components/ThemeToggle";
import InternetCheck from "./components/ConnectionStatus";

import { translations } from "./utils/translations.js";
import { useNotes } from "./utils/useNotes.js";

import "./App.css";
import TreeView from "./components/TreeView.jsx";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerType, setTriggerType] = useState(null);
  const [queryText, setQueryText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    note,
    setNote,
    savedNotes,
    warning,
    handleSave,
    handleClear,
    togglePin,
  } = useNotes();

  const commonProps = { darkMode, language, translations };

  const parseTrigger = (input) => {
    const match = input.match(/^@(\w+)\s+(.*)$/);
    if (match) {
      return {
        trigger: match[1].toLowerCase(),
        query: match[2],
      };
    }
    return { trigger: null, query: "" };
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const { trigger, query } = parseTrigger(value);
    setTriggerType(trigger);
    setQueryText(query);
    setShowSuggestions(value.startsWith("@") && !trigger);
  };

  const handleSuggestionClick = (trigger) => {
    setSearchQuery(`${trigger} `);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      if (triggerType) {
        switch (triggerType) {
          case "stack":
            setActiveView("stackoverflow");
            break;
          case "json":
            setActiveView("json-validator");
            break;
          case "notes":
            setActiveView("notes");
            break;
          default:
            setActiveView("notes");
            break;
        }
      }
    }
  };

  const highlightTriggerWords = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span key={index} className="highlighted-trigger">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleToolClick = (tool) => {
    setActiveView(tool);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "notes":
        return (
          <div className="space-y">
            <div className="tool-container">
              <NoteTaker
                note={note}
                setNote={setNote}
                onSave={handleSave}
                onClear={handleClear}
                warning={warning}
                {...commonProps}
              />
            </div>
            <div className="tool-container">
              <SavedNotes
                savedNotes={savedNotes}
                onTogglePin={togglePin}
                {...commonProps}
              />
            </div>
          </div>
        );
      case "json-validator":
        return (
          <div className="tool-container">
            <JsonValidator query={queryText} {...commonProps} />
          </div>
        );
      case "stackoverflow":
        return (
          <div className="tool-container">
            <StackOverflow query={searchQuery.replace(/^@stack\s*/, "")} />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="tools-grid">
        <div onClick={() => handleToolClick("notes")} className="tool-card">
          <div className="tool-card-content">
            <StickyNote className="tool-icon" />
            <h3 className="tool-title">Notes</h3>
          </div>
        </div>
        <div
          onClick={() => handleToolClick("json-validator")}
          className="tool-card featured"
        >
          <div className="tool-card-content">
            <FileText className="tool-icon" />
            <h3 className="tool-title">JSON Validator</h3>
          </div>
        </div>
        <div
          onClick={() => handleToolClick("stackoverflow")}
          className="tool-card"
        >
          <div className="tool-card-content">
            <ExternalLink className="tool-icon" />
            <h3 className="tool-title">Stack Overflow</h3>
          </div>
        </div>
      </div>

      <div className="dev-tips-section">
        <h2 className="section-title">Dev Tips</h2>
        <div className="dev-tips-container">
          <div className="dev-tip-content">
            <p>
              "Use meaningful variable names to{" "}
              <span className="highlight">improve code readability</span>, e.g.,{" "}
              <code>userCount</code> instead of <code>x</code>."
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="app-content">
        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="logo-text">LOGO</div>
            <h1 className="app-title">
              {translations[language]?.title || "StackMate"}
            </h1>
          </div>

          <div className="header-controls">
            <InternetCheck darkMode={darkMode} />

            <div className="control-wrapper">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="control-button color-picker-button"
              />
              {showColorPicker && (
                <div className="popup-overlay">
                  <div className="popup-container">
                    <button
                      onClick={() => setShowColorPicker(false)}
                      className="close-button"
                    >
                      ×
                    </button>
                    <ColorPicker />
                  </div>
                </div>
              )}
            </div>

            <div className="control-wrapper">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="control-button language-button"
              >
                <Languages className="control-icon" />
              </button>
              {showLanguageSelector && (
                <div className="popup-overlay">
                  <div className="popup-container">
                    <button
                      onClick={() => setShowLanguageSelector(false)}
                      className="close-button"
                    >
                      ×
                    </button>
                    <LanguageSelector
                      language={language}
                      setLanguage={setLanguage}
                      translations={translations}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="control-wrapper">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="control-button theme-button"
              >
                {darkMode ? (
                  <Sun className="control-icon" />
                ) : (
                  <Moon className="control-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        {activeView === "dashboard" && (
          <div className="search-wrapper">
            <Search className="search-icon" />
            <div className="search-highlight">
              {highlightTriggerWords(searchQuery)}
            </div>
            <textarea
              className="search-real-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="search with @stack @json @notes ..... "
              rows={1}
            />
            {showSuggestions && (
              <ul className="trigger-suggestions">
                {["@stack", "@json", "@notes"].map((trigger) => (
                  <li
                    key={trigger}
                    onClick={() => handleSuggestionClick(trigger)}
                  >
                    {trigger}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Back Button */}
        {activeView !== "dashboard" && (
          <button
            onClick={() => setActiveView("dashboard")}
            className="back-button"
          >
            ← Back to Dashboard
          </button>
        )}

        {/* Main Content */}
        <div className="main-content">{renderActiveView()}</div>
      </div>

      {/* Hidden toggle */}
      <div className="hidden">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <TreeView />
    </div>
  );
};

export default App;
