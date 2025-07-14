import { useState, useEffect } from "react";
import vscode from "../utils/VScode.js";
import { showMessage } from "./helpers.js";

export const useNotes = () => {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const handleMessage = (event) => {
      const { command, payload } = event.data;
      if (command === "loadNotes") {
        setSavedNotes(payload || []);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSave = () => {
    if (note.trim() === "") {
      setWarning("Cannot save an empty note!");
      return;
    }

    const firstWord = note.trim().split(/\s+/)[0];
    const newNote = {
      id: Date.now(),
      title: firstWord,
      content: note,
      pinned: false,
    };

    const updatedNotes = (() => {
      const pinned = savedNotes.filter((n) => n.pinned);
      const unpinned = savedNotes.filter((n) => !n.pinned);
      return [...pinned, newNote, ...unpinned];
    })();

    setSavedNotes(updatedNotes);
    setNote("");
    setWarning("");
    showMessage("Note Saved!");

    vscode.postMessage({
      command: "saveNotes",
      payload: updatedNotes,
    });
  };

  const handleClear = () => {
    setSavedNotes([]);
    setWarning("");
    vscode.postMessage({
      command: "saveNotes",
      payload: [],
    });
  };

  const togglePin = (id) => {
    const updated = savedNotes
      .map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
      .sort((a, b) => b.pinned - a.pinned || b.id - a.id);

    setSavedNotes(updated);

    vscode.postMessage({
      command: "saveNotes",
      payload: updated,
    });
  };

  const handleRenameNote = (id, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;

    const updated = savedNotes.map((note) =>
      note.id === id ? { ...note, title: newTitle.trim() } : note
    );
    setSavedNotes(updated);

    vscode.postMessage({
      command: "saveNotes",
      payload: updated,
    });
  };

  const handleDeleteNote = (id) => {
    const updated = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(updated);
  
    vscode.postMessage({
      command: "saveNotes",
      payload: updated,
    });
  };
  

  const filteredNotes = savedNotes.filter((note) =>
    note.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
    
  const handleEditNote = (id, newContent) => {
    const updated = savedNotes.map((note) =>
      note.id === id ? { ...note, content: newContent } : note
    );
    setSavedNotes(updated);
    vscode.postMessage({
      command: "saveNotes",
      payload: updated,
    });
  };

  return {
    note,
    setNote,
    savedNotes,
    filteredNotes,
    searchTerm,
    setSearchTerm,
    warning,
    handleSave,
    handleClear,
    togglePin,
    handleRenameNote,
      handleDeleteNote,
    handleEditNote,
  };
};
