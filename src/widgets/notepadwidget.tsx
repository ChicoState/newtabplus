import React, { useState} from 'react';

// set to export 
export const NoteForm = ({ onSaveNote }) => {
    const [noteText, setNoteText] = useState('');
    const handleChange = (event) => {
      setNoteText(event.target.value);
    };
    // use trim
    const handleSave = () => {
      if (noteText.trim()) {
        onSaveNote(noteText);
        setNoteText('');
      }
    };
  //set the note area with a save button
    return (
      <div>
        <textarea
          placeholder="Your notes here."
          value={noteText}
          onChange={handleChange}
          rows="10"
          cols="40"
        />
        
        <button onClick={handleSave}>Save Note</button>
      </div>
    );
  };