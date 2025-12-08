import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToDoList } from '../ToDoList';

describe('ToDoList Widget', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders with title', () => {
    render(<ToDoList />);

    expect(screen.getByText('My To-Do List')).toBeInTheDocument();
  });

  it('renders input field and add button', () => {
    render(<ToDoList />);

    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('adds a new task when clicking Add button', () => {
    render(<ToDoList />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add' });

    // Type a task
    fireEvent.change(input, { target: { value: 'Buy groceries' } });

    // Click add button
    fireEvent.click(addButton);

    // Check that task appears in the list
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();

    // Input should be cleared
    expect(input.value).toBe('');
  });

  it('adds a new task when pressing Enter', () => {
    render(<ToDoList />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;

    // Type a task
    fireEvent.change(input, { target: { value: 'Write tests' } });

    // Press Enter
    fireEvent.keyDown(input, { key: 'Enter' });

    // Check that task appears in the list
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('does not add empty tasks', () => {
    render(<ToDoList />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add' });

    // Try to add empty task
    fireEvent.click(addButton);

    // No tasks should be in the list
    const list = screen.getByRole('list');
    expect(list.children.length).toBe(0);

    // Try to add whitespace only
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(addButton);

    // Still no tasks
    expect(list.children.length).toBe(0);
  });

  it('toggles task completion when clicked', () => {
    render(<ToDoList />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;

    // Add a task
    fireEvent.change(input, { target: { value: 'Complete project' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    const taskItem = screen.getByText('Complete project').closest('li');

    // Initially not completed
    expect(taskItem).not.toHaveClass('completed');

    // Click to toggle
    fireEvent.click(taskItem!);

    // Should now be completed
    expect(taskItem).toHaveClass('completed');

    // Click again to toggle back
    fireEvent.click(taskItem!);

    // Should not be completed
    expect(taskItem).not.toHaveClass('completed');
  });

  it('deletes a task when delete button is clicked', () => {
    render(<ToDoList />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;

    // Add a task
    fireEvent.change(input, { target: { value: 'Delete me' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Task should be present
    expect(screen.getByText('Delete me')).toBeInTheDocument();

    // Find and click the delete button
    const taskItem = screen.getByText('Delete me').closest('li');
    const deleteButton = taskItem?.querySelector('button');

    fireEvent.click(deleteButton!);

    // Task should be removed
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });

  it('saves tasks to localStorage', () => {
    render(<ToDoList />);

    const input = screen.getByPlaceholderText('Add a new task...') as HTMLInputElement;

    // Add a task
    fireEvent.change(input, { target: { value: 'Persistent task' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Check localStorage
    const saved = localStorage.getItem('todo-tasks');
    expect(saved).toBeTruthy();

    const tasks = JSON.parse(saved!);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].text).toBe('Persistent task');
    expect(tasks[0].completed).toBe(false);
  });

  it('loads tasks from localStorage on mount', () => {
    // Pre-populate localStorage
    const savedTasks = [
      { text: 'Task 1', completed: false },
      { text: 'Task 2', completed: true },
    ];
    localStorage.setItem('todo-tasks', JSON.stringify(savedTasks));

    render(<ToDoList />);

    // Both tasks should be rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();

    // Task 2 should be marked as completed
    const task2 = screen.getByText('Task 2').closest('li');
    expect(task2).toHaveClass('completed');
  });
});
