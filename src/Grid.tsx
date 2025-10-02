import React, {
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
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<GridPosition>(initialPosition);
  const [size, setSize] = useState<GridSize>(initialSize);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const ctx = useContext(GridContext);

  function pixelToGrid(x: number, y: number): [number, number] {
    return [Math.round(x / ctx.cellSize), Math.round(y / ctx.cellSize)];
  }

  function handleDrag(x: number, y: number, dragging: boolean) {
    let [gridX, gridY] = pixelToGrid(x, y);
    gridX = Math.min(ctx.width - size.width, Math.max(0, gridX));
    gridY = Math.min(ctx.height - size.height, Math.max(0, gridY));
    setPosition({ gridX: gridX, gridY: gridY });
    setDragging(dragging);
  }

  function handleResizeLeft(x: number, y: number, dragging: boolean) {
    x -= ctx.cellSize / 2;
    const [gridX, gridY] = pixelToGrid(x, y);
    setDragging(dragging);
    setResizing(dragging);

    setPosition({
      gridX: gridX,
      gridY: position.gridY,
    });
  }

  function handleResizeRight(x: number, y: number, dragging: boolean) {
    x += ctx.cellSize / 2;
    const [gridX, gridY] = pixelToGrid(x, y);
    setResizing(dragging);

    setSize({
      width: Math.max(1, gridX - position.gridX),
      height: size.height,
    });
  }

  function handleResizeUp(x: number, y: number, dragging: boolean) {
    y -= ctx.cellSize / 2;
    const [gridX, gridY] = pixelToGrid(x, y);
    setDragging(dragging);
    setResizing(dragging);

    setPosition({
      gridX: position.gridX,
      gridY: gridY,
    });
  }

  function handleResizeDown(x: number, y: number, dragging: boolean) {
    y += ctx.cellSize / 2;
    const [gridX, gridY] = pixelToGrid(x, y);
    setResizing(dragging);

    setSize({
      width: size.width,
      height: Math.max(1, gridY - position.gridY),
    });
  }

  return (
    <div
      className={[
        styles.gridItem,
        dragging ? styles.dragging : "",
        resizing ? styles.resizing : "",
      ].join(" ")}
      style={{
        left: position.gridX * ctx.cellSize,
        top: position.gridY * ctx.cellSize,
        width: size.width * ctx.cellSize,
        height: size.height * ctx.cellSize,
      }}
      ref={ref}
    >
      <Draggable onDrag={handleDrag}>{children}</Draggable>

      <div className={[styles.resize, styles.resizeLeft].join(" ")}>
        <Draggable onDrag={handleResizeLeft}></Draggable>
      </div>

      <div className={[styles.resize, styles.resizeRight].join(" ")}>
        <Draggable onDrag={handleResizeRight}></Draggable>
      </div>

      <div className={[styles.resize, styles.resizeUp].join(" ")}>
        <Draggable onDrag={handleResizeUp}></Draggable>
      </div>

      <div className={[styles.resize, styles.resizeDown].join(" ")}>
        <Draggable onDrag={handleResizeDown}></Draggable>
      </div>
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
  children?: React.ReactNode;
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
