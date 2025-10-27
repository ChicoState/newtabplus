import React, { createContext } from "react";
import { GridSize, GridItem, GridPosition } from "./Grid";
import styles from "./Widget.css";

export interface WidgetState<TSettings> {
  id: string;
  type: string;
  size: GridSize;
  position: GridPosition;
  settings: TSettings;
}

interface WidgetContextType {
  size: GridSize;
}

const WidgetContext = createContext<WidgetContextType>(null);

export default function Widget({
  id,
  size = { width: 6, height: 4 },
  position = { gridX: 0, gridY: 0 },
  resizeable = { x: true, y: true },
  children,
}: {
  id: string;
  size?: GridSize;
  position?: GridPosition;
  resizeable?: { x: boolean; y: boolean };
  children: React.ReactNode;
}) {
  size.width = Math.max(1, size.width);
  size.height = Math.max(1, size.height);

  return (
    <WidgetContext.Provider
      value={{
        size: size,
      }}
    >
      <div className={styles.widget}>
        <GridItem
          id={id}
          resizeable={resizeable}
          initialSize={size}
          initialPosition={position}
        >
          {children}
        </GridItem>
      </div>
    </WidgetContext.Provider>
  );
}
