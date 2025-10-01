import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Draggable } from "./Drag";
import styles from "./Grid.css";

export interface GridPosition {
  gridX: number;
  gridY: number;
}

export interface GridSize {
  width: number;
  height: number;
  // minWidth: number;
  // minHeight: number;
}

interface GridContextType {
  width: number;
  height: number;
  cellSize: number;
}

const GridContext = createContext<GridContextType>(null);

export function GridItem({
  initialSize,
  initialPosition,
  children,
}: {
  initialSize: GridSize;
  initialPosition: GridPosition;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<GridPosition>(initialPosition);
  const [size, setSize] = useState<GridSize>(initialSize);
  const [dragging, setDragging] = useState(false);
  const ctx = useContext(GridContext);

  // useEffect(() => {
  //   if (ref.current && ctx.cellSize > 0) {
  //     console.log(ref.current.offsetWidth, ctx.cellSize);
  //     setSize({
  //       width: Math.ceil(ref.current.offsetWidth / ctx.cellSize),
  //       height: Math.ceil(ref.current.offsetHeight / ctx.cellSize),
  //     });
  //   }
  // }, [ctx.cellSize]);

  function handleDrag(x: number, y: number, dragging: boolean) {
    const gridX = Math.min(
      ctx.width - size.width,
      Math.max(0, Math.round(x / ctx.cellSize)),
    );
    const gridY = Math.min(
      ctx.height - size.height,
      Math.max(0, Math.round(y / ctx.cellSize)),
    );
    setPosition({ gridX: gridX, gridY: gridY });
    setDragging(dragging);
  }

  return (
    <div
      className={[styles.gridItem, dragging ? styles.drag : ""].join(" ")}
      style={{
        left: position.gridX * ctx.cellSize,
        top: position.gridY * ctx.cellSize,
        width: size.width * ctx.cellSize,
        height: size.height * ctx.cellSize,
      }}
      ref={ref}
    >
      <Draggable onDrag={handleDrag}>{children}</Draggable>
    </div>
  );
}

function GridSlot() {
  return (
    <div className={styles.gridSlot}>
      <div className={styles.gridSlotInner}></div>
    </div>
  );
}

export function Grid({
  width = 16,
  height = 8,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    function update() {
      setCellSize(ref.current.offsetWidth / width);
    }

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [width, height]);

  const slots = [];
  for (let i = 0; i < width * height; i++) {
    slots.push(<GridSlot key={i}></GridSlot>);
  }

  return (
    <div className={styles.grid} ref={ref}>
      <div
        className={styles.gridSlots}
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {slots}
      </div>
      <div className={styles.gridItems}>
        <GridContext
          value={{
            width: width,
            height: height,
            cellSize: cellSize,
          }}
        >
          {children}
        </GridContext>
      </div>
    </div>
  );
}
