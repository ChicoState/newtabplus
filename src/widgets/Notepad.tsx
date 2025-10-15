import React, { useState, useEffect } from "react";
import styles from "./Notepad.css";

export function Notepad() {
  const [note, setNote] = useState("");

  // Load saved note on startup
  useEffect(() => {
    const savedNote = localStorage.getItem("notepad-note");
    if (savedNote) setNote(savedNote);
  }, []);

  // Save note to localStorage on every change
  useEffect(() => {
    localStorage.setItem("notepad-note", note);
  }, [note]);

  return (
    <div className={styles.body}>
      <h3 className={styles.title}>My Notes</h3>
      <textarea
        className={styles.textarea}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your notes here..."
      />
    </div>
  );
}