import React, { useEffect, useState } from "react";
import { WidgetState } from "../Widget";
import styles from "./Clock.css";

export interface ClockSettings {
  use24HourClock: boolean;
  showAMPM: boolean;
  showDate: boolean;
  showYear: boolean;
}

export function Clock({ settings }: WidgetState<ClockSettings>) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.body}>
      <span className={styles.clock}>
        {(settings.use24HourClock
          ? date.getHours()
          : date.getHours() % 12 || 12) +
          ":" +
          date.getMinutes().toString().padStart(2, "0") +
          (!settings.use24HourClock && settings.showAMPM
            ? date.getHours() > 11
              ? " PM"
              : " AM"
            : "")}
      </span>
      {settings.showDate && (
        <span className={styles.date}>
          {date.toLocaleDateString(undefined, {
            weekday: "long",
            year: settings.showYear ? "numeric" : undefined,
            month: "long",
            day: "numeric",
          })}
        </span>
      )}
    </div>
  );
}
