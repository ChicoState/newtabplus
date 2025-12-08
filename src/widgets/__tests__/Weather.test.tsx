import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Weather } from '../Weather';

// Mock the openmeteo API
jest.mock('openmeteo', () => ({
  fetchWeatherApi: jest.fn(),
}));

import { fetchWeatherApi } from 'openmeteo';

describe('Weather Widget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    // Mock geolocation to not call the callback immediately
    const mockGeolocation = {
      getCurrentPosition: jest.fn(),
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    render(<Weather />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders 7 day placeholders while loading', () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn(),
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    const { container } = render(<Weather />);

    // Should render 7 empty day placeholders
    const days = container.querySelectorAll('[class*="day"]');
    expect(days.length).toBe(7);
  });

  it('fetches and displays weather data after geolocation', async () => {
    // Mock geolocation
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.0060,
      },
    };

    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) => {
        success(mockPosition);
      }),
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    // Mock weather API response
    const mockDaily = {
      variables: jest.fn((index) => ({
        valuesArray: () => {
          if (index === 0) return [60, 65, 70, 68, 72, 75, 73]; // min temps
          if (index === 1) return [75, 80, 85, 82, 88, 90, 87]; // max temps
          return [20, 40, 60, 30, 50, 70, 80]; // cloud cover
        },
      })),
    };

    const mockResponse = {
      daily: () => mockDaily,
    };

    (fetchWeatherApi as jest.Mock).mockResolvedValue([mockResponse]);

    const { container } = render(<Weather />);

    // Wait for weather data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check that temperatures are displayed
    await waitFor(() => {
      expect(screen.getByText('60')).toBeInTheDocument(); // min temp
      expect(screen.getByText('80')).toBeInTheDocument(); // max temp
    });

    // Should render 7 days of weather
    const days = container.querySelectorAll('[class*="day"]');
    expect(days.length).toBe(7);
  });

  it('calls geolocation API on mount', () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn(),
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    render(<Weather />);

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('calls weather API with correct coordinates', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    };

    const mockGeolocation = {
      getCurrentPosition: jest.fn((success) => {
        success(mockPosition);
      }),
    };
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });

    const mockDaily = {
      variables: jest.fn((index) => ({
        valuesArray: () => [70, 75, 78, 80, 82, 85, 83],
      })),
    };

    const mockResponse = {
      daily: () => mockDaily,
    };

    (fetchWeatherApi as jest.Mock).mockResolvedValue([mockResponse]);

    render(<Weather />);

    await waitFor(() => {
      expect(fetchWeatherApi).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast',
        expect.objectContaining({
          latitude: 37.7749,
          longitude: -122.4194,
          temperature_unit: 'fahrenheit',
        })
      );
    });
  });
});
