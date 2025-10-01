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
}

const DragContext = createContext<DragContextType>({
  isDragging: false,
  activeItem: null,
});

export function Draggable({
  onDrag,
  children,
}: {
  onDrag: DragCallback;
  children: React.ReactNode;
}) {
  const ctx = useContext(DragContext);
  const ref = useRef<HTMLElement>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseDown(e: React.MouseEvent) {
    if (ctx.isDragging) return;

    ctx.isDragging = true;
    ctx.activeItem = ref.current;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top });

    onDrag(position.x, position.y, ctx.isDragging);
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (!ctx.isDragging || ctx.activeItem !== ref.current) return;

    ctx.isDragging = false;
    ctx.activeItem = null;

    onDrag(position.x, position.y, ctx.isDragging);
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!ctx.isDragging || ctx.activeItem !== ref.current) return;
    e.preventDefault();
    setPosition({ x: position.x + e.movementX, y: position.y + e.movementY });
    onDrag(position.x, position.y, ctx.isDragging);
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
        cursor: "move",
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}

// export default function DragHandler({
//   onDrag,
//   children,
// }: {
//   onDrag: DragCallback;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <DragContext
//         value={{ isDragging: false, activeItem: null, onDrag: onDrag }}
//       >
//         {Children.map(children, (child) => (
//           <Draggable>{child}</Draggable>
//         ))}
//       </DragContext>
//     </div>
//   );
// }
