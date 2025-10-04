import React, { useEffect, useState } from "react";
import Widget from "../Widget";
import styles from "./Clock.css";

export function Clock() {
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
    <Widget size={{ width: 6, height: 3 }}>
      <div className={styles.body}>
        <span className={styles.clock}>
          {date.getHours() + ":" + date.getMinutes()}
        </span>
        <span className={styles.date}>
          {date.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </Widget>
  );
}
