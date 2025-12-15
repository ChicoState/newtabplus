import React, { useState, useEffect } from 'react';
import { WidgetState } from "../Widget";
import styles from "./CountDown.css";

export function CountdownTimer5({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(timer);
  }, [deadline]); 
  // Re-run effect if deadline changes

  function calculateTimeLeft(targetDate) {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  return (
    <div>
      {Object.keys(timeLeft).length ? (
        <p>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      ) : (
        <p>Time's up!</p>
      )}
    </div>
  );
}

//export default CountdownTimer;