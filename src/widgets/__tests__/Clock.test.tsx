import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Clock } from '../Clock';
import { WidgetState } from '../../Widget';

describe('Clock Widget', () => {
  it('renders without crashing', () => {
    const mockWidget: WidgetState<any> = {
      id: 'test-123',
      type: 'clock',
      settings: {
        use24HourClock: false,
        showDate: true,
        showYear: true,
      },
      size: { width: 2, height: 2 },
      position: { gridX: 0, gridY: 0 },
    };

    render(<Clock {...mockWidget} />);

    // Check that time is rendered (should contain a colon for hours:minutes)
    expect(screen.getByText(/:/)).toBeInTheDocument();
  });

  it('displays date when showDate is true', () => {
    const mockWidget: WidgetState<any> = {
      id: 'test-123',
      type: 'clock',
      settings: {
        use24HourClock: false,
        showDate: true,
        showYear: false,
      },
      size: { width: 2, height: 2 },
      position: { gridX: 0, gridY: 0 },
    };

    render(<Clock {...mockWidget} />);

    // Check if a day of the week is rendered (Monday, Tuesday, etc.)
    const dayPattern = /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/;
    expect(screen.getByText(dayPattern)).toBeInTheDocument();
  });

  it('hides date when showDate is false', () => {
    const mockWidget: WidgetState<any> = {
      id: 'test-123',
      type: 'clock',
      settings: {
        use24HourClock: false,
        showDate: false,
        showYear: false,
      },
      size: { width: 2, height: 2 },
      position: { gridX: 0, gridY: 0 },
    };

    render(<Clock {...mockWidget} />);

    // Check that no day of the week is rendered
    const dayPattern = /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/;
    expect(screen.queryByText(dayPattern)).not.toBeInTheDocument();
  });
});
