import React from "react";
import { useDroppable, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function FormCanvas({ fields = [], onSelect, selectedId, onRemove, onAddFieldFromDrag, onReorder, darkMode }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  function handleDragEnd(event) {
    const { active, over } = event;
    
    console.log("[FormCanvas] handleDragEnd called");
    console.log("[FormCanvas] active.id:", active.id);
    console.log("[FormCanvas] over?.id:", over?.id);
    
    if (!over) {
      console.log("[FormCanvas] No over target, returning");
      return;
    }
    
    // Check if this is a field type being dragged from sidebar (starts with "field-type-")
    const isFieldTypeDrag = active.id.toString().startsWith("field-type-");
    if (isFieldTypeDrag) {
      console.log("[FormCanvas] Field-type drag detected");
      // Only add if dropped on canvas droppable
      if (over.id === "canvas") {
        const type = active.data.current?.type;
        if (type) {
          console.log("[FormCanvas] Calling onAddFieldFromDrag with type:", type);
          onAddFieldFromDrag(type);
        } else {
          console.log("[FormCanvas] No type found in active.data.current");
        }
      } else {
        console.log("[FormCanvas] Field-type drag not dropped on canvas, dropped on:", over.id);
      }
      return;
    }

    // Handle reordering of existing fields
    if (active.id === over.id) {
      console.log("[FormCanvas] Same ID, no reorder needed");
      return;
    }

    const oldIndex = fields.findIndex(f => f.id === active.id);
    const newIndex = fields.findIndex(f => f.id === over.id);
    
    console.log("[FormCanvas] Reorder check - oldIndex:", oldIndex, "newIndex:", newIndex);
    
    // Only reorder if both are valid field IDs
    if (oldIndex !== -1 && newIndex !== -1) {
      console.log("[FormCanvas] Reordering fields");
      onReorder(arrayMove(fields, oldIndex, newIndex));
    } else {
      console.log("[FormCanvas] Reorder not possible - invalid indices");
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <div style={{ marginBottom: 12, color: "#666" }}><b>Canvas</b> - Just drag and drop fields here and reorder them using the drag handle</div>

        <div
          ref={setNodeRef}
          style={{
            minHeight: 300,
            border: "2px dashed #eee",
            borderRadius: 8,
            padding: 12,
            background: isOver ? "#f0f7ff" : "#fff",
            transition: "background 0.15s ease"
          }}
        >
          {fields.length === 0 && (
            <div style={{ textAlign: "center", color: "#999", paddingTop: 60 }}>
              Drag fields here — or use Add Field buttons.
            </div>
          )}

          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((f) => (
              <SortableField
                key={f.id}
                field={f}
                selected={selectedId === f.id}
                onSelect={() => onSelect(f.id)}
                onRemove={() => onRemove(f.id)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
}

function SortableField({ field, selected, onSelect, onRemove }) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
  } = useSortable({ id: field.id });

  const style = {
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    cursor: isDragging ? "grabbing" : "grab",
    background: isDragging 
      ? "#e8f0ff" 
      : selected 
        ? "#e8f0ff" 
        : "#fafafa",
    border: isDragging
      ? "1px solid #7da7ff"
      : selected 
        ? "1px solid #7da7ff" 
        : "1px solid #eee",
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div 
          style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
          onClick={onSelect}
        >
          <div 
            {...listeners}
            style={{ 
              color: "#999", 
              fontSize: 18, 
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              padding: "4px",
              marginLeft: "-4px",
              display: "flex",
              alignItems: "center"
            }}
            title="Drag to reorder"
          >
            ⋮⋮
          </div>
          <div style={{ flex: 1, cursor: "pointer" }}>
            <strong>{field.label}</strong>
            <div style={{ color: "#666", fontSize: 13 }}>{fieldPreviewText(field)}</div>
          </div>
        </div>
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            onRemove(); 
          }}
          style={{ 
            border: "none", 
            background: "transparent", 
            cursor: "pointer", 
            color: "#d00",
            padding: "4px 8px",
            borderRadius: 4
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function fieldPreviewText(f) {
  if (!f) return "";
  if (f.type === "text") return "Text input";
  if (f.type === "number") return "Number input";
  if (f.type === "checkbox") return "Checkbox";
  if (f.type === "select") return `Options: ${f.options?.join(", ")}`;
  return f.type;
}
