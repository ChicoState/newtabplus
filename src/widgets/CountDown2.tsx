import React, { useState, useEffect } from 'react';
import { WidgetState } from "../Widget";

interface CountdownTimerProps {
    targetDate: Date;
  }
  
export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
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
    };
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
  
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer);
    });
  
    const timerComponents = [];
  
    Object.keys(timeLeft).forEach((interval) => {
      if (!(timeLeft as any)[interval]) {
        return;
      }
  
      timerComponents.push(
        <span key={interval}>
          {
            {
              days: `${(timeLeft as any)[interval]}d`,
              hours: `${(timeLeft as any)[interval]}h`,
              minutes: `${(timeLeft as any)[interval]}m`,
              seconds: `${(timeLeft as any)[interval]}s`,
            }[interval]
          }{' '}
        </span>
      );
    });
  
    return (
      <div>
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </div>
    );
  };
  
 // export default CountdownTimer;