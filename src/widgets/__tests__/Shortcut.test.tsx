import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Shortcut, ShortcutSettings } from '../Shortcut';
import { WidgetState } from '../../Widget';

const createMockWidgetState = (website: string, openInNewTab = false): WidgetState<ShortcutSettings> => ({
  id: 'test-id',
  type: 'shortcut',
  size: { width: 1, height: 1 },
  position: { gridX: 0, gridY: 0 },
  settings: {
    website,
    openInNewTab,
  },
});

describe('Shortcut Widget', () => {
  it('renders a link with the provided URL', () => {
    const testUrl = 'https://example.com';
    const mockState = createMockWidgetState(testUrl);
    const { container } = render(<Shortcut {...mockState} />);

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', testUrl);
    expect(link).toHaveAttribute('title', testUrl);
  });

  it('renders with default settings', () => {
    const mockState = createMockWidgetState('https://example.com');
    const { container } = render(<Shortcut {...mockState} />);

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_self');
  });

  it('attempts to load favicon from the URL', () => {
    const testUrl = 'https://github.com';
    const mockState = createMockWidgetState(testUrl);
    const { container } = render(<Shortcut {...mockState} />);

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://github.com/favicon.ico');
  });

  it('shows link icon initially before favicon loads', () => {
    const testUrl = 'https://example.com';
    const mockState = createMockWidgetState(testUrl);
    render(<Shortcut {...mockState} />);

    // The LinkIcon should be rendered initially
    // We can't easily test for the icon itself, but we can verify the image is hidden
    const img = screen.getByRole('img', { hidden: true });
    expect(img).toHaveStyle({ display: 'none' });
  });

  it('shows favicon after image loads', () => {
    const testUrl = 'https://example.com';
    const mockState = createMockWidgetState(testUrl);
    const { container } = render(<Shortcut {...mockState} />);

    const img = container.querySelector('img') as HTMLImageElement;

    // Simulate image load
    fireEvent.load(img);

    // After loading, the image should be visible
    expect(img).toHaveStyle({ display: 'initial' });
  });

  it('opens in new tab when openInNewTab is true', () => {
    const testUrl = 'https://example.com';
    const mockState = createMockWidgetState(testUrl, true);
    const { container } = render(<Shortcut {...mockState} />);

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
