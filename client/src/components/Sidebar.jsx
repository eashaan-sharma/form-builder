import { useDraggable } from "@dnd-kit/core";
import { useRef, useEffect } from "react";

function DraggableFieldButton({ txt, type, onAdd }) {
  const wasDraggedRef = useRef(false);
  const prevIsDraggingRef = useRef(false);
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `field-type-${type}`,
    data: {
      type: type,
    },
  });

  // Track if drag actually occurred (transform changed)
  useEffect(() => {
    if (isDragging && !prevIsDraggingRef.current) {
      // Drag just started
      wasDraggedRef.current = false;
    }
    if (isDragging && transform) {
      // Drag is happening with movement
      wasDraggedRef.current = true;
    }
    if (!isDragging && prevIsDraggingRef.current) {
      // Drag just ended, reset after a short delay
      setTimeout(() => {
        wasDraggedRef.current = false;
      }, 100);
    }
    prevIsDraggingRef.current = isDragging;
  }, [isDragging, transform]);

  const style = {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 8,
    borderRadius: 6,
    border: "1px solid #ddd",
    background: isDragging ? "#f0f7ff" : "#fff",
    cursor: "grab",
    opacity: isDragging ? 0.5 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const handleClick = (e) => {
    // Only add on click if we didn't just drag
    if (wasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      console.log("[Sidebar] Click prevented - drag was detected for type:", type);
      return;
    }
    console.log("[Sidebar] Click-to-add triggered for type:", type);
    onAdd(type);
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
    >
      {txt}
    </button>
  );
}

export default function Sidebar({ onAdd, onSave, title, setTitle }) {
  return (
    <aside style={{ padding: 12 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", fontSize: 12, color: "#666" }}>Form title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: "8px 0" }}>Add field</h4>
        <DraggableFieldButton txt="Single-line Text" type="text" onAdd={onAdd} />
        <DraggableFieldButton txt="Checkbox" type="checkbox" onAdd={onAdd} />
        <DraggableFieldButton txt="Dropdown / Select" type="select" onAdd={onAdd} />
        <DraggableFieldButton txt="Number" type="number" onAdd={onAdd} />
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={onSave}
          style={{ width: "100%", padding: 10, borderRadius: 6, background: "#0b79f7", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Save form
        </button>
      </div>
    </aside>
  );
}
  