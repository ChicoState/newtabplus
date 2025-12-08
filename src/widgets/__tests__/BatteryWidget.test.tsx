import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BatteryWidget } from '../BatteryWidget';

describe('BatteryWidget', () => {
  it('shows placeholder when battery API is not available', () => {
    // Ensure getBattery is not available
    const nav = navigator as any;
    nav.getBattery = undefined;

    render(<BatteryWidget />);

    // Should show "—%" when API is not available
    expect(screen.getByText('—%')).toBeInTheDocument();
  });

  it('renders battery icon SVG', () => {
    const { container } = render(<BatteryWidget />);

    // Check that SVG is rendered
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 52 24');
  });

  it('displays battery percentage when API is available', async () => {
    // Mock the Battery API
    const mockBattery = {
      level: 0.75, // 75%
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const nav = navigator as any;
    nav.getBattery = jest.fn().mockResolvedValue(mockBattery);

    render(<BatteryWidget />);

    // Wait for the async battery API call to complete
    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  it('updates battery level when it changes', async () => {
    let levelChangeCallback: (() => void) | null = null;

    const mockBattery = {
      level: 0.80,
      addEventListener: jest.fn((event, callback) => {
        if (event === 'levelchange') {
          levelChangeCallback = callback;
        }
      }),
      removeEventListener: jest.fn(),
    };

    const nav = navigator as any;
    nav.getBattery = jest.fn().mockResolvedValue(mockBattery);

    render(<BatteryWidget />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    // Simulate battery level change
    mockBattery.level = 0.50;
    if (levelChangeCallback) {
      act(() => {
        levelChangeCallback();
      });
    }

    // Check that UI updated
    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  it('applies low battery styling when battery is below 20%', async () => {
    const mockBattery = {
      level: 0.15, // 15%
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const nav = navigator as any;
    nav.getBattery = jest.fn().mockResolvedValue(mockBattery);

    const { container } = render(<BatteryWidget />);

    await waitFor(() => {
      expect(screen.getByText('15%')).toBeInTheDocument();
    });

    // Check that the low class is applied
    const row = container.querySelector('[class*="low"]');
    expect(row).toBeInTheDocument();
  });

  it('applies ok styling when battery is above 20%', async () => {
    const mockBattery = {
      level: 0.85, // 85%
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };

    const nav = navigator as any;
    nav.getBattery = jest.fn().mockResolvedValue(mockBattery);

    const { container } = render(<BatteryWidget />);

    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    // Check that the ok class is applied
    const row = container.querySelector('[class*="ok"]');
    expect(row).toBeInTheDocument();
  });
});
