import React, { useState, useEffect } from "react";
import globalStyles from "../App.css";
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
    <div className={[globalStyles.container, styles.body].join(" ")}>
      <h3 className={styles.title}>My Notes</h3>
      <textarea
        className={[globalStyles.container, styles.textarea].join(" ")}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Type your notes here..."
      />
    </div>
  );
}
