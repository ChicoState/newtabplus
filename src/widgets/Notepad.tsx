import React, { useState, useEffect } from "react";
import globalStyles from "../App.css";
import styles from "./Notepad.css";
import { PushPin } from "@phosphor-icons/react";

interface NoteState {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
}

export function Notepad() {
  const [notes, setNotes] = useState<NoteState[]>([
    { id: "1", title: "Note 1", content: "", pinned: false },
  ]);
  const [activeNoteId, setActiveNoteId] = useState("1");
  const [editingId, setEditingId] = useState<string>(null);
  const [tempTitle, setTempTitle] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("multi-notes");
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotes(parsed);
      if (parsed.length > 0) setActiveNoteId(parsed[0].id);
    } else {
      createNewNote(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("multi-notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = (isInitial = false) => {
    const id = Date.now().toString();
    const nextNumber = isInitial || notes.length === 0 ? 1 : notes.length + 1;
    const newNote = {
      id,
      title: `Note ${nextNumber}`,
      content: "",
      pinned: false,
    };
    setNotes((prev) => [...prev, newNote]);
    setActiveNoteId(id);
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (remaining.length > 0) {
      setActiveNoteId(remaining[0].id);
    } else {
      createNewNote(true);
    }
  };

  const renameNote = (id: string, newTitle: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title: newTitle } : n)),
    );
  };

  const updateContent = (id: string, newContent: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content: newContent } : n)),
    );
  };

  const togglePin = (id: string) => {
    setNotes(
      (prev) =>
        prev
          .map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
          .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)), // pinned notes first
    );
  };

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setTempTitle(currentTitle);
  };

  const finishEditing = () => {
    if (editingId) renameNote(editingId, tempTitle.trim() || "Untitled");
    setEditingId(null);
    setTempTitle("");
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div className={[globalStyles.container, styles.body].join(" ")}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {notes.map((note) => (
          <div
            key={note.id}
            className={`${styles.tab} ${
              note.id === activeNoteId ? styles.activeTab : ""
            }`}
            onClick={() => setActiveNoteId(note.id)}
          >
            {editingId === note.id ? (
              <input
                className={styles.renameInput}
                value={tempTitle}
                autoFocus
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={finishEditing}
                onKeyDown={(e) => e.key === "Enter" && finishEditing()}
              />
            ) : (
              <span
                onDoubleClick={() => startEditing(note.id, note.title)}
                title="Double-click to rename"
              >
                {note.title}
              </span>
            )}

            {/* Pin button using Phosphor PinIcon */}
            <button
              className={styles.pinBtn}
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note.id);
              }}
              title={note.pinned ? "Unpin note" : "Pin note"}
            >
              <PushPin
                size={16}
                weight={note.pinned ? "fill" : "regular"}
                color={note.pinned ? "#ffd700" : "#fff9"}
              />
            </button>

            {/* Close button */}
            <button
              className={styles.closeBtn}
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button className={styles.addBtn} onClick={() => createNewNote()}>
          +
        </button>
      </div>

      {/* Note editor */}
      {activeNote && (
        <>
          <h3 className={styles.title}>{activeNote.title}</h3>
          <textarea
            className={[globalStyles.container, styles.textarea].join(" ")}
            value={activeNote.content}
            onChange={(e) => updateContent(activeNote.id, e.target.value)}
            placeholder="Type your notes here..."
          />
        </>
      )}
    </div>
  );
}
