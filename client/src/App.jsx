import { useEffect, useState } from "react";
import { pingServer } from "./api/test";
import Sidebar from "./components/Sidebar";
import FormCanvas from "./components/FormCanvas";
import FieldRenderer from "./components/FieldRenderer";
import { saveForm as apiSaveForm } from "./api/forms";

export default function App() {
  const [msg, setMsg] = useState("loading...");
  const [fields, setFields] = useState([]); // array of field objects
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("Untitled form");

  useEffect(() => {
    pingServer().then(setMsg);
  }, []);

  // A / B: add field helper
  function addField(type) {
    const id = Date.now().toString();
    const base = {
      id,
      type,
      label: type === "text" ? "Untitled" : type === "checkbox" ? "Checkbox" : "Select",
      required: false,
      options: type === "select" ? ["Option 1", "Option 2"] : [],
    };
    setFields((s) => [...s, base]);
    setSelectedId(id);
  }

  function updateField(id, patch) {
    setFields((s) => s.map(f => f.id === id ? { ...f, ...patch } : f));
  }

  function removeField(id) {
    setFields((s) => s.filter(f => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  // D: save form to backend
  async function saveForm() {
    const payload = { title, fields };
    try {
      const res = await apiSaveForm(payload);
      alert("Form saved! id: " + res.id);
    } catch (err) {
      console.error(err);
      alert("Save failed — check console");
    }
  }

  // layout styles (simple)
  const layout = {
    display: "grid",
    gridTemplateColumns: "240px 1fr 320px",
    gap: "16px",
    alignItems: "start",
    padding: "20px",
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <header style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
        <h1 style={{ margin: 0 }}>Form Builder</h1>
        <div style={{ color: "#666", marginTop: 6 }}>Backend status: {msg}</div>
      </header>

      <main style={layout}>
        <Sidebar onAdd={addField} onSave={saveForm} title={title} setTitle={setTitle} />

        <div>
          <FormCanvas
            fields={fields}
            onSelect={(id) => setSelectedId(id)}
            selectedId={selectedId}
            onRemove={removeField}
          />
        </div>

        <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
          <h3>Properties</h3>
          {selectedId ? (
            <FieldRenderer
              field={fields.find(f => f.id === selectedId)}
              onChange={(patch) => updateField(selectedId, patch)}
            />
          ) : (
            <div style={{ color: "#666" }}>Select a field to edit properties</div>
          )}
        </div>
      </main>
    </div>
  );
}
