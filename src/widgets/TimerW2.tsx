import React, { useState, useEffect } from 'react';
import { WidgetState } from "../Widget";

export function TimerWidget() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000); 
      // Update every second
    }

    return () => clearInterval(intervalId); 
    // Cleanup on unmount or when isRunning changes
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div>
      <h2>Timer: {seconds}s</h2>
      <button onClick={handleStart} disabled={isRunning}>Start</button>
      <button onClick={handleStop} disabled={!isRunning}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

//export default TimerWidget;