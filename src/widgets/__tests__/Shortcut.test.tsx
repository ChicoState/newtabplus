import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Shortcut } from '../Shortcut';

describe('Shortcut Widget', () => {
  it('renders a link with the provided URL', () => {
    const testUrl = 'https://example.com';
    const { container } = render(<Shortcut url={testUrl} />);

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', testUrl);
    expect(link).toHaveAttribute('title', testUrl);
  });

  it('renders without a URL', () => {
    const { container } = render(<Shortcut />);

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '');
  });

  it('attempts to load favicon from the URL', () => {
    const testUrl = 'https://github.com';
    const { container } = render(<Shortcut url={testUrl} />);

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://github.com/favicon.ico');
  });

  it('shows link icon initially before favicon loads', () => {
    const testUrl = 'https://example.com';
    render(<Shortcut url={testUrl} />);

    // The LinkIcon should be rendered initially
    // We can't easily test for the icon itself, but we can verify the image is hidden
    const img = screen.getByRole('img', { hidden: true });
    expect(img).toHaveStyle({ display: 'none' });
  });

  it('shows favicon after image loads', () => {
    const testUrl = 'https://example.com';
    const { container } = render(<Shortcut url={testUrl} />);

    const img = container.querySelector('img') as HTMLImageElement;

    // Simulate image load
    fireEvent.load(img);

    // After loading, the image should be visible
    expect(img).toHaveStyle({ display: 'initial' });
  });
});
