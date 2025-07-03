import React, { useState } from 'react';
import { Search, Palette, Globe, Moon, Sun, StickyNote, FileText, ExternalLink, Star, Languages } from 'lucide-react';

import LanguageSelector from './components/LanguageSelector';
import DevTip from './components/DevTip';
import NoteTaker from './components/NoteTaker';
import SavedNotes from './components/SavedNotes';
import JsonValidator from './components/JsonValidator';
import ColorPicker from './components/ColorPicker';
import StackOverflow from './components/StackOverflow';
import ThemeToggle from './components/ThemeToggle';
import InternetCheck from './components/ConnectionStatus';

import { translations } from "./utils/translations.js";
import { useNotes } from "./utils/useNotes.js";

import './App.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");

  const [activeView, setActiveView] = useState('dashboard');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleToolClick = (tool) => {
    setActiveView(tool);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'notes':
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
      case 'json-validator':
        return (
          <div className="tool-container">
            <JsonValidator {...commonProps} />
          </div>
        );
      case 'stackoverflow':
        return (
          <div className="tool-container">
            <StackOverflow />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Main Tools Grid */}
      <div className="tools-grid">
        {/* Notes Tool */}
        <div
          onClick={() => handleToolClick('notes')}
          className="tool-card"
        >
          <div className="tool-card-content">
            <StickyNote className="tool-icon" />
            <h3 className="tool-title">notes</h3>
          </div>
        </div>

        {/* JSON Validator Tool */}
        <div
          onClick={() => handleToolClick('json-validator')}
          className="tool-card featured"
        >
          <div className="tool-card-content">
            <FileText className="tool-icon" />
            <h3 className="tool-title">JSON Validator</h3>
          </div>
        </div>

        {/* Stack Overflow Search Tool */}
        <div
          onClick={() => handleToolClick('stackoverflow')}
          className="tool-card"
        >
          <div className="tool-card-content">
            <ExternalLink className="tool-icon" />
            <h3 className="tool-title">Stack Overflow</h3>
          </div>
        </div>
      </div>

      {/* Dev Tips Section */}
      <div className="dev-tips-section">
        <h2 className="section-title">Dev tips</h2>
        <div className="dev-tips-container">
          <div className="dev-tip-content">
            <p>"Use meaningful variable names to <span className="highlight">improve code readability</span>, e.g., `userCount` instead of `x`."</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <div className="app-content">
        <div className="header">
          <div className="header-left">
            <div className="logo-text">LOGO</div>
            <h1 className="app-title">
              {translations[language]?.title || 'StackMate'}
            </h1>
          </div>

          {/* Header Controls */}
          <div className="header-controls">
            {/* Internet Connection Status */}
            <InternetCheck darkMode={darkMode} />

            {/* Color Picker */}
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

            {/* Language Selector */}
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

            {/* Theme Toggle */}
            <div className="control-wrapper">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="control-button theme-button"
              >
                {darkMode ? (
                  <Sun className="control-icon sun-icon" />
                ) : (
                  <Moon className="control-icon moon-icon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {/* {activeView === 'dashboard' && (
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={translations[language]?.search || "Search..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )} */}

        {/* Back Button for non-dashboard views */}
        {/* {activeView !== 'dashboard' && (
          <button
            onClick={() => setActiveView('dashboard')}
            className="back-button"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
        )} */}

        {/* Main Content */}
        {/* <div className="main-content">
          {renderActiveView()}
        </div> */}
      </div>


      {/* <div className="hidden">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div> */}
    </div>
  );
};

export default App;