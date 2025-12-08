import React, { useEffect, useState } from "react";
import { WidgetState } from "../Widget";
import globalStyles from "../App.css";
import styles from "./Calendar.css";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

export interface CalendarSettings {}

export function Calendar({ settings }: WidgetState<CalendarSettings>) {
  const [date, setDate] = useState<Date>(new Date());
  const offset = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = [];
  for (let i = -offset; i < 42 - offset; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i + 1));
  }

  return (
    <div className={[globalStyles.container, styles.body].join(" ")}>
      <div className={styles.header}>
        <div className={styles.selector}>
          <button
            className={styles.selectorButton}
            onClick={() => {
              const _month = new Date(date);
              _month.setMonth(_month.getMonth() - 1);
              setDate(_month);
            }}
          >
            <CaretLeftIcon size={16} weight={"bold"}></CaretLeftIcon>
          </button>
          <span>
            {date.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className={styles.selectorButton}
            onClick={() => {
              const _month = new Date(date);
              _month.setMonth(_month.getMonth() + 1);
              setDate(_month);
            }}
          >
            <CaretRightIcon size={16} weight={"bold"}></CaretRightIcon>
          </button>
        </div>
      </div>
      <div className={styles.dayNames}>
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
      <div className={styles.month}>
        {days.map((d, i) => {
          const inMonth =
            d.getFullYear() === date.getFullYear() &&
            d.getMonth() === date.getMonth();

          const now = new Date();
          const today =
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth() &&
            d.getDate() === now.getDate();
          return (
            <div
              className={[
                styles.day,
                inMonth ? styles.active : "",
                today ? styles.today : "",
              ].join(" ")}
              key={i}
            >
              <span>{d.getDate()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
