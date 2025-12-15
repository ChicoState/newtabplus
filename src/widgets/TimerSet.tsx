import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WidgetState } from "../Widget";
// it finally worked holy shit
// after so many iteratiosn i finally got this to work.
const TimerWidgetSet = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const totalMilliseconds = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeRemaining = useCallback(() => {
    // Calculate remaining time in H:M:S from totalMilliseconds
    const totalSeconds = Math.floor(totalMilliseconds.current / 1000);
    const remainingSeconds = totalSeconds % 60;
    const remainingMinutes = Math.floor((totalSeconds / 60) % 60);
    const remainingHours = Math.floor(totalSeconds / 3600);

    setHours(remainingHours);
    setMinutes(remainingMinutes);
    setSeconds(remainingSeconds);

    if (totalMilliseconds.current <= 0) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      totalMilliseconds.current = 0;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        totalMilliseconds.current -= 1000;
        calculateTimeRemaining();
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, calculateTimeRemaining]);

  const handleStart = () => {
    // Set total milliseconds based on current input values
    const initialTimeInMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (initialTimeInMs > 0) {
      totalMilliseconds.current = initialTimeInMs;
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    totalMilliseconds.current = 0;
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };
  
  // Helper to format time with leading zeros
  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div>
      <h1>Timer Widget</h1>
      {isRunning ? (
        <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
          <span>{formatTime(hours)}</span>:
          <span>{formatTime(minutes)}</span>:
          <span>{formatTime(seconds)}</span>
        </div>
      ) : (
        <div className="time-inputs">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            min="0"
            placeholder="HH"
            style={{ width: '60px', fontSize: '18px' }}
          />
          :
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            min="0"
            max="59"
            placeholder="MM"
            style={{ width: '60px', fontSize: '18px' }}
          />
          :
          <input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            min="0"
            max="59"
            placeholder="SS"
            style={{ width: '60px', fontSize: '18px' }}
          />
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleStart} disabled={isRunning}>Start</button>
        <button onClick={handleStop} disabled={!isRunning}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default TimerWidgetSet;
