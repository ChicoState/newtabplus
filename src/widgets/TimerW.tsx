import React, { useEffect, useState } from "react";
import { WidgetState } from "../Widget";


export const CountdownTimer = ({ initialSeconds = 0 }) => {
//const CountdownTimer = ({ initialSeconds = 0 }) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
  
    useEffect(() => {
      let interval;
      if (isRunning && seconds > 0) {
        interval = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds - 1);
        }, 1000);
      } else if (seconds === 0 && isRunning) {
        setIsRunning(false); 
        // Stop the timer when it reaches zero
      }
      return () => clearInterval(interval); 
      // Cleanup on component unmount or re-render
    }, [isRunning, seconds]);
    //  set the is running to true
    
    const startTimer = () => {
      setIsRunning(true);
    };
  
    const pauseTimer = () => {
      setIsRunning(false);
    };
  
    const resetTimer = () => {
      setIsRunning(false);
      setSeconds(initialSeconds);
    };
  
    const formatTime = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const remainingSeconds = timeInSeconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
  
    return (
      <div className="timer-widget">
        <h1>{formatTime(seconds)}</h1>
        <div>
          <button onClick={startTimer} disabled={isRunning || seconds === 0}>Start</button>
          <button onClick={pauseTimer} disabled={!isRunning}>Pause</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>
    );
  };
  
  //export default CountdownTimer;