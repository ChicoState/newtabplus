// BatteryWidget.tsx (charging removed)
import React, { useEffect, useState } from "react";
import styles from "./BatteryWidget.css"; 

export default function BatteryWidget() {
  const [percent, setPercent] = useState<number | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      const nav: any = navigator as any;
      if (!nav.getBattery) return; // non-Chromium browsers: show "—%"

      const mgr = await nav.getBattery();

      const update = () => {
        const lvl = typeof mgr.level === "number" ? mgr.level : 0; // 0..1
        setPercent(Math.round(lvl * 100));
      };

      update(); // initial value
      mgr.addEventListener("levelchange", update);

      cleanup = () => {
        mgr.removeEventListener("levelchange", update);
      };
    })();

    return () => cleanup?.();
  }, []);

  const clamped = percent == null ? 0 : Math.max(0, Math.min(100, percent));
  const tier = percent == null ? "neutral" : percent <= 20 ? "low" : "ok";

  const INNER_MAX = 40;
  const innerWidth = Math.round((clamped / 100) * INNER_MAX);

  return (
    <div
      className={`${styles.row} ${styles[tier]}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent ?? undefined}
      aria-label="Battery level"
    >
      <span className={styles.value}>{percent != null ? `${percent}%` : "—%"}</span>

      <svg className={styles.icon} viewBox="0 0 52 24" aria-hidden="true">
        {/* outline */}
        <rect x="1" y="3" width="44" height="18" rx="5" className={styles.body} />
        {/* cap */}
        <rect x="46" y="8" width="5" height="8" rx="2" className={styles.cap} />
        {/* fill */}
        <rect x="3" y="5" width={innerWidth} height="14" rx="4" className={styles.level} />
      </svg>
    </div>
  );
}
