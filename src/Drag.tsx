import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type DragCallback = (x: number, y: number, dragging: boolean) => void;

interface DragContextType {
  isDragging: boolean;
  activeItem?: HTMLElement;
  dragStart: { x: number; y: number };
}

const DragContext = createContext<DragContextType>({
  isDragging: false,
  activeItem: null,
  dragStart: { x: 0, y: 0 },
});

export function Draggable({
  enabled = true,
  onDrag = () => {},
  onDragRelative = () => {},
  children,
}: {
  enabled?: boolean;
  onDrag?: DragCallback;
  onDragRelative?: DragCallback;
  children?: React.ReactNode;
}) {
  const ctx = useContext(DragContext);
  const ref = useRef<HTMLElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseDown(e: React.MouseEvent) {
    if (ctx.isDragging) return;
    e.preventDefault();

    ctx.isDragging = true;
    ctx.activeItem = ref.current;
    const rect = ref.current.getBoundingClientRect();
    ctx.dragStart = { x: rect.left, y: rect.top };
    setPosition({ x: rect.left, y: rect.top });

    onDrag(rect.left, rect.top, true);
    onDragRelative(0, 0, true);
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!ctx.isDragging || ctx.activeItem !== ref.current) return;
    e.preventDefault();

    ctx.isDragging = false;
    ctx.activeItem = null;

    onDrag(position.x, position.y, false);
    onDragRelative(0, 0, false);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!ctx.isDragging || ctx.activeItem !== ref.current) return;
    e.preventDefault();
    setPosition({ x: position.x + e.movementX, y: position.y + e.movementY });

    onDrag(position.x, position.y, true);
    onDragRelative(
      position.x - ctx.dragStart.x,
      position.y - ctx.dragStart.y,
      true,
    );
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseUp);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseUp);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        pointerEvents: enabled ? "auto" : "none",
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}
