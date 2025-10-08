import React from "react";
import { GridSize, GridItem, GridPosition } from "./Grid";
import styles from "./Widget.css";

export default function Widget({
  size = { width: 6, height: 4 },
  position = { gridX: 0, gridY: 0 },
  resizeable = true,
  children,
}: {
  size?: GridSize;
  position?: GridPosition;
  resizeable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.widget}>
      <GridItem
        resizeable={resizeable}
        initialSize={size}
        initialPosition={position}
      >
        {children}
      </GridItem>
    </div>
  );
}
