import { useDraggable } from "@dnd-kit/core";

export default function Palette() {
  const components = [
    { id: "text", label: "Text Input" },
    { id: "textarea", label: "Textarea" },
    { id: "checkbox", label: "Checkbox" },
    { id: "select", label: "Select" },
    { id: "heading", label: "Heading" },
  ];

  return (
    <div className="w-64 bg-gray-100 h-full p-4 border-r">
      <h2 className="text-xl font-semibold mb-4">Components</h2>

      {components.map((c) => (
        <DraggableItem key={c.id} id={c.id} label={c.label} />
      ))}
    </div>
  );
}

function DraggableItem({ id, label }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { type: id },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 mb-2 bg-white rounded shadow cursor-grab"
    >
      {label}
    </div>
  );
}
