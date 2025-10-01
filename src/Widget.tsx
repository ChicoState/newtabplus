import React from "react";
import { GridSize, GridItem } from "./Grid";
import styles from "./Widget.css";

export default function Widget({
  size,
  children,
}: {
  size: GridSize;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.widget}>
      <GridItem initialSize={size} initialPosition={{ gridX: 0, gridY: 0 }}>
        {children}
      </GridItem>
    </div>
  );
}
