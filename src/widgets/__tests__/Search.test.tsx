import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Search } from '../Search';
import { WidgetState } from '../../Widget';

describe('Search Widget', () => {
  it('renders search input', () => {
    const mockWidget: WidgetState<any> = {
      id: 'test-123',
      type: 'search',
      settings: {
        showIcon: true,
        showButton: true,
      },
      size: { width: 2, height: 1 },
      position: { gridX: 0, gridY: 0 },
    };

    render(<Search {...mockWidget} />);

    // Check that the search input is rendered
    expect(screen.getByPlaceholderText('Search for something')).toBeInTheDocument();
  });

  it('renders without icon when showIcon is false', () => {
    const mockWidget: WidgetState<any> = {
      id: 'test-123',
      type: 'search',
      settings: {
        showIcon: false,
        showButton: true,
      },
      size: { width: 2, height: 1 },
      position: { gridX: 0, gridY: 0 },
    };

    const { container } = render(<Search {...mockWidget} />);

    // Search input should still be there
    expect(screen.getByPlaceholderText('Search for something')).toBeInTheDocument();

    // Check that there's a submit button
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
  });

  it('renders without button when showButton is false', () => {
    const mockWidget: WidgetState<any> = {
      id: 'test-123',
      type: 'search',
      settings: {
        showIcon: true,
        showButton: false,
      },
      size: { width: 2, height: 1 },
      position: { gridX: 0, gridY: 0 },
    };

    const { container } = render(<Search {...mockWidget} />);

    // Search input should be there
    expect(screen.getByPlaceholderText('Search for something')).toBeInTheDocument();

    // Button should not be present
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('form submits to Google search', () => {
    const mockWidget: WidgetState<any> = {
      id: 'test-123',
      type: 'search',
      settings: {
        showIcon: true,
        showButton: true,
      },
      size: { width: 2, height: 1 },
      position: { gridX: 0, gridY: 0 },
    };

    const { container } = render(<Search {...mockWidget} />);
    const form = container.querySelector('form');

    // Check that form action points to Google
    expect(form).toHaveAttribute('action', 'https://www.google.com/search');
  });
});
