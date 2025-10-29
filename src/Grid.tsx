import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable from "./Drag";
import styles from "./Grid.css";
import { WidgetState } from "./Widget";
import { AppContext } from "./App";

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
  grid: HTMLElement;
  width: number;
  height: number;
  cellSize: number;
  items: Map<HTMLElement, WidgetState<any>>;
}

const GridContext = createContext<GridContextType>(null);

export function GridItem({
  id,
  initialSize,
  initialPosition,
  resizeable,
  children,
}: {
  id: string;
  initialSize: GridSize;
  initialPosition: GridPosition;
  resizeable?: { x: boolean; y: boolean };
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(GridContext);
  const { widgets, removeWidget, editing, deleting } = useContext(AppContext);
  const state = widgets.find((widget) => widget.id === id);
  const [position, setPosition] = useState<GridPosition>(initialPosition);
  const [size, setSize] = useState<GridSize>(initialSize);

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const [lastPosition, setLastPosition] = useState<GridPosition>(position);
  const [lastSize, setLastSize] = useState<GridSize>(size);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setSize(initialSize);
    setPosition(initialPosition);
  }, [initialSize, initialPosition]);

  useEffect(() => {
    ctx.items.set(ref.current, state);
    verifyPosition();

    state.size = size;
    state.position = position;

    return () => {
      ctx.items.delete(ref.current);
    };
  }, [size, position, ref.current]);

  function pixelToGrid(x: number, y: number): [number, number] {
    x -= ctx.grid.offsetLeft;
    y -= ctx.grid.offsetTop;
    return [Math.round(x / ctx.cellSize), Math.round(y / ctx.cellSize)];
  }

  function verifyPosition() {
    let output = true;
    ctx.items.forEach((state, el) => {
      if (el === ref.current) return;

      const overlapping =
        position.gridX < state.position.gridX + state.size.width &&
        position.gridX + size.width > state.position.gridX &&
        position.gridY < state.position.gridY + state.size.height &&
        position.gridY + size.height > state.position.gridY;

      if (overlapping) output = false;
    });
    setIsValid(output);
  }

  function handleDrag(x: number, y: number, drag: boolean) {
    let [gridX, gridY] = pixelToGrid(x, y);
    gridX = Math.min(ctx.width - size.width, Math.max(0, gridX));
    gridY = Math.min(ctx.height - size.height, Math.max(0, gridY));

    setPosition({ gridX: gridX, gridY: gridY });
    setDragging(drag);

    if (isValid) {
      setLastPosition(position);
    } else if (!drag && dragging) {
      setPosition(lastPosition);
    }
  }

  function handleResizeLeft(x: number, y: number, drag: boolean) {
    x -= ctx.cellSize / 2;
    handleDrag(x, position.gridY * ctx.cellSize + ctx.grid.offsetTop, drag);
  }

  function handleResizeRight(x: number, y: number, drag: boolean) {
    x += ctx.cellSize / 2;
    const [gridX, gridY] = pixelToGrid(x, y);
    setResizing(drag);

    setSize({
      width: Math.min(
        ctx.width - position.gridX,
        Math.max(1, gridX - position.gridX),
      ),
      height: size.height,
    });

    if (isValid) {
      setLastSize(size);
    } else if (!drag && resizing) {
      setSize(lastSize);
    }
  }

  function handleResizeUp(x: number, y: number, drag: boolean) {
    y -= ctx.cellSize / 2;
    handleDrag(position.gridX * ctx.cellSize, y, drag);
  }

  function handleResizeDown(x: number, y: number, drag: boolean) {
    y += ctx.cellSize / 2;
    const [gridX, gridY] = pixelToGrid(x, y);
    setResizing(drag);

    setSize({
      width: size.width,
      height: Math.min(
        ctx.height - position.gridY,
        Math.max(1, gridY - position.gridY),
      ),
    });

    if (isValid) {
      setLastSize(size);
    } else if (!drag && resizing) {
      setSize(lastSize);
    }
  }

  return (
    <div
      id={id}
      className={[
        styles.gridItem,
        dragging ? styles.dragging : "",
        resizing ? styles.resizing : "",
        editing ? styles.editing : "",
        deleting ? styles.deleting : "",
        !isValid ? styles.invalid : "",
      ].join(" ")}
      style={{
        left: position.gridX * ctx.cellSize,
        top: position.gridY * ctx.cellSize,
        width: size.width * ctx.cellSize,
        height: size.height * ctx.cellSize,
      }}
      ref={ref}
      onClick={() => {
        if (editing && deleting) removeWidget(id);
      }}
    >
      <Draggable enabled={editing} onDrag={handleDrag}>
        {children}
      </Draggable>

      {editing && resizeable.x && (
        <div className={[styles.resize, styles.resizeLeft].join(" ")}>
          <Draggable onDrag={handleResizeLeft}></Draggable>
        </div>
      )}

      {editing && resizeable.x && (
        <div className={[styles.resize, styles.resizeRight].join(" ")}>
          <Draggable onDrag={handleResizeRight}></Draggable>
        </div>
      )}

      {editing && resizeable.y && (
        <div className={[styles.resize, styles.resizeUp].join(" ")}>
          <Draggable onDrag={handleResizeUp}></Draggable>
        </div>
      )}

      {editing && resizeable.y && (
        <div className={[styles.resize, styles.resizeDown].join(" ")}>
          <Draggable onDrag={handleResizeDown}></Draggable>
        </div>
      )}
    </div>
  );
}

function GridSlot({ index }: { index: number }) {
  return (
    <div className={styles.gridSlot}>
      <div
        className={styles.gridSlotInner}
        style={{ animationDelay: 10 * index + "ms" }}
      ></div>
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
  const ref = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0);
  const { editing, deleting } = useContext(AppContext);

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

  const slots = useMemo(() => {
    const _slots = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        _slots.push(<GridSlot key={x + y * width} index={x + y} />);
      }
    }
    return _slots;
  }, [width, height]);

  return (
    <div className={styles.grid} ref={ref}>
      {editing && (
        <div
          className={styles.gridSlots}
          style={{
            gridTemplateColumns: `repeat(${width}, 1fr)`,
            gridTemplateRows: `repeat(${height}, 1fr)`,
          }}
        >
          {slots}
        </div>
      )}
      <div className={styles.gridItems}>
        <GridContext.Provider
          value={{
            grid: ref.current,
            width: width,
            height: height,
            cellSize: cellSize,
            items: new Map(),
          }}
        >
          {children}
        </GridContext.Provider>
      </div>
    </div>
  );
}
