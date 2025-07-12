import { useState,useEffect } from "react";
import vscode from "../utils/VScode.js";

import { showMessage } from "./helpers.js";


export const useNotes = () => {
    const [note, setNote] = useState("");
    const [savedNotes, setSavedNotes] = useState([]);
    



    const [warning, setWarning] = useState("");
    useEffect(() => {
        const handleMessage = (event) => {
          const { command, payload } = event.data;
          if (command === "loadNotes") {
            setSavedNotes(payload || []);
          }
        };
      
        window.addEventListener("message", handleMessage);
      
        return () => {
          window.removeEventListener("message", handleMessage);
        };
      }, []);
      

    const handleSave = () => {
        if (note.trim() === "") {
          setWarning("Cannot save an empty note!");
          return;
        }
      
        const newNote = {
          id: Date.now(),
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
      
    // extension ko send kar rahe hai..
        vscode.postMessage({
          command: "saveNotes",
          payload: updated,
        });
      };
      
    

    return {
        note,
        setNote,
        savedNotes,
        warning,
        handleSave,
        handleClear,
        togglePin,
    };
};