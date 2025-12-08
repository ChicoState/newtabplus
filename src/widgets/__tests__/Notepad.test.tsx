import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Notepad } from '../Notepad';

describe('Notepad Widget', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders notepad with default note title', () => {
    render(<Notepad />);

    // Check that "Note 1" appears (may appear multiple times in tabs and title)
    const note1Elements = screen.getAllByText('Note 1');
    expect(note1Elements.length).toBeGreaterThan(0);
  });

  it('renders textarea with placeholder', () => {
    render(<Notepad />);

    // Check that textarea is present
    expect(screen.getByPlaceholderText('Type your notes here...')).toBeInTheDocument();
  });

  it('allows typing in the textarea', () => {
    render(<Notepad />);

    const textarea = screen.getByPlaceholderText('Type your notes here...') as HTMLTextAreaElement;

    // Type in the textarea
    fireEvent.change(textarea, { target: { value: 'My test note' } });

    // Check that the value was updated
    expect(textarea.value).toBe('My test note');
  });

  it('saves notes to localStorage when typing', () => {
    render(<Notepad />);

    const textarea = screen.getByPlaceholderText('Type your notes here...') as HTMLTextAreaElement;

    // Type in the textarea
    fireEvent.change(textarea, { target: { value: 'Remember to test!' } });

    // Check that localStorage was updated with multi-notes structure
    const saved = localStorage.getItem('multi-notes');
    expect(saved).toBeTruthy();
    const notes = JSON.parse(saved!);
    expect(notes.length).toBeGreaterThan(0);
    // Check that at least one note has the content we typed
    const noteWithContent = notes.find((n: any) => n.content === 'Remember to test!');
    expect(noteWithContent).toBeTruthy();
    expect(noteWithContent.content).toBe('Remember to test!');
  });

  it('loads saved notes from localStorage on mount', () => {
    // Pre-populate localStorage with multi-notes structure
    const savedNotes = [
      { id: '1', title: 'Note 1', content: 'Previously saved note', pinned: false }
    ];
    localStorage.setItem('multi-notes', JSON.stringify(savedNotes));

    render(<Notepad />);

    const textarea = screen.getByPlaceholderText('Type your notes here...') as HTMLTextAreaElement;

    // Check that the saved note was loaded
    expect(textarea.value).toBe('Previously saved note');
  });
});
