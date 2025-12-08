import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Notepad } from '../Notepad';

describe('Notepad Widget', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders notepad with title', () => {
    render(<Notepad />);

    // Check that the title is present
    expect(screen.getByText('My Notes')).toBeInTheDocument();
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

  it('saves note to localStorage when typing', () => {
    render(<Notepad />);

    const textarea = screen.getByPlaceholderText('Type your notes here...') as HTMLTextAreaElement;

    // Type in the textarea
    fireEvent.change(textarea, { target: { value: 'Remember to test!' } });

    // Check that localStorage was updated
    expect(localStorage.getItem('notepad-note')).toBe('Remember to test!');
  });

  it('loads saved note from localStorage on mount', () => {
    // Pre-populate localStorage
    localStorage.setItem('notepad-note', 'Previously saved note');

    render(<Notepad />);

    const textarea = screen.getByPlaceholderText('Type your notes here...') as HTMLTextAreaElement;

    // Check that the saved note was loaded
    expect(textarea.value).toBe('Previously saved note');
  });
});
