import { useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";
import { pingServer } from "./api/test";
import Sidebar from "./components/Sidebar";
import FormCanvas from "./components/FormCanvas";
import FieldRenderer from "./components/FieldRenderer";
import LivePreview from "./components/LivePreview";
import FormList from "./components/FormList";
import PublicForm from "./pages/PublicForm";
import Dashboard from "./pages/Dashboard";
import Submissions from "./pages/Submissions";
import { saveForm as apiSaveForm, getForm as apiGetForm } from "./api/forms";

export default function App() {
  const [msg, setMsg] = useState("loading...");
  const [view, setView] = useState("builder"); // "builder" or "list"
  const [fields, setFields] = useState([]); // array of field objects
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("Untitled form");
  const [formId, setFormId] = useState(null); // Track the current form's ID
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    pingServer().then(setMsg);
  }, []);

  // Load form if id query param exists
  useEffect(() => {
    const formIdParam = searchParams.get("id");
    if (formIdParam) {
      loadForm(formIdParam);
      setView("builder");
      // Clear the query param after loading
      setSearchParams({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debug: Log fields state changes
  useEffect(() => {
    console.log("[App] Fields state changed. Count:", fields.length);
    console.log("[App] Fields:", JSON.stringify(fields, null, 2));
  }, [fields]);

  function addField(type) {
    console.log("[App] addField called with type:", type);
    const id = Date.now().toString();
    const base = {
      id,
      type,
      label:
        type === "text"
          ? "Untitled"
          : type === "checkbox"
          ? "Checkbox"
          : "Select",
      required: false,
      options: type === "select" ? ["Option 1", "Option 2"] : [],
    };
    setFields((s) => {
      const newFields = [...s, base];
      console.log("[App] Fields state updated. Previous count:", s.length, "New count:", newFields.length);
      console.log("[App] New field added:", base);
      return newFields;
    });
    setSelectedId(id);
  }

  function updateField(id, patch) {
    setFields((s) => s.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function removeField(id) {
    setFields((s) => s.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  async function saveForm() {
    const payload = formId ? { id: formId, title, fields } : { title, fields };
    
    console.log("[App] saveForm called");
    console.log("[App] Payload BEFORE apiSaveForm:", JSON.stringify(payload, null, 2));
    console.log("[App] Payload fields count:", payload.fields?.length || 0);
    console.log("[App] Payload title:", payload.title);
    console.log("[App] Payload formId:", payload.id || "none (new form)");
    
    try {
      const res = await apiSaveForm(payload);
      setFormId(res.id);
      alert("Form saved! id: " + res.id);
    } catch (err) {
      console.error("[App] Save error:", err);
      alert("Save failed — check console");
    }
  }

  async function loadForm(id) {
    try {
      const form = await apiGetForm(id);
      setTitle(form.title);
      setFields(form.fields || []);
      setFormId(form.id);
      setSelectedId(null);
      // Don't show alert when loading from list view
    } catch (err) {
      console.error(err);
      alert("Failed to load form — check console");
    }
  }

  function editForm(id) {
    loadForm(id);
    setView("builder");
  }

  function handleCreateNew() {
    setView("builder");
    // Reset form state for new form
    setFields([]);
    setTitle("Untitled form");
    setFormId(null);
    setSelectedId(null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const type = active.data.current?.type;
    
    console.log("[App] handleDragEnd called");
    console.log("[App] active.id:", active.id);
    console.log("[App] over?.id:", over?.id);
    console.log("[App] type from data:", type);
    
    // Check if this is a field-type drag (from sidebar)
    // Note: FormCanvas's nested DndContext should handle this, but we check here as fallback
    const isFieldTypeDrag = active.id.toString().startsWith("field-type-");
    
    // Only add field if dropped on the canvas droppable area
    // Note: FormCanvas's handleDragEnd should handle this first, but this is a fallback
    if (isFieldTypeDrag && type && over && over.id === "canvas") {
      console.log("[App] Drag-to-add detected (fallback): type", type, "dropped on canvas");
      console.log("[App] Note: FormCanvas should have handled this - this might be a duplicate");
      addField(type);
    } else if (!isFieldTypeDrag) {
      // Not a field-type drag, might be something else - log for debugging
      console.log("[App] Not a field-type drag, ignoring");
    } else {
      console.log("[App] Drag-to-add NOT triggered - conditions not met");
      if (!type) console.log("[App]   - Missing type in active.data.current");
      if (!over) console.log("[App]   - No over target");
      if (over && over.id !== "canvas") console.log("[App]   - Dropped on:", over.id, "not 'canvas'");
    }
  }

  const layout = {
    display: "grid",
    gridTemplateColumns: "240px 1fr 320px",
    gap: "16px",
    alignItems: "start",
    padding: "20px",
  };

  // ✅ Fixed: everything inside return
  return (
    <Routes>
      <Route path="/forms/:id" element={<PublicForm />} />
      <Route path="/forms/:id/submissions" element={<Submissions />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forms" element={
        <DndContext onDragEnd={handleDragEnd}>
          <div style={{ fontFamily: "system-ui, sans-serif" }}>
            <header style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="text-4xl font-bold text-blue-600">Form Builder</h1>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    onClick={() => setView("list")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#0b79f7",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "all 0.2s ease"
                    }}
                  >
                    My Forms
                  </button>
                  <button
                    onClick={handleCreateNew}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#fff",
                      color: "#333",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "all 0.2s ease"
                    }}
                  >
                    Create New Form
                  </button>
                </div>
              </div>
              <div style={{ color: "#666", marginTop: 6 }}>Backend status: {msg}</div>
            </header>
            <FormList onEditForm={editForm} />
          </div>
        </DndContext>
      } />
      <Route path="*" element={
        <DndContext onDragEnd={handleDragEnd}>
          <div style={{ fontFamily: "system-ui, sans-serif" }}>
            <header style={{ padding: "16px 20px", borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 className="text-4xl font-bold text-blue-600">Form Builder</h1>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    onClick={() => setView("list")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: view === "list" ? "#0b79f7" : "#fff",
                      color: view === "list" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "all 0.2s ease"
                    }}
                  >
                    My Forms
                  </button>
                  <button
                    onClick={handleCreateNew}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: view === "builder" ? "#0b79f7" : "#fff",
                      color: view === "builder" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "all 0.2s ease"
                    }}
                  >
                    Create New Form
                  </button>
                </div>
              </div>
              <div style={{ color: "#666", marginTop: 6 }}>Backend status: {msg}</div>
            </header>

            {view === "builder" ? (
              <>
                <main style={layout}>
                  <Sidebar
                    onAdd={addField}
                    onSave={saveForm}
                    title={title}
                    setTitle={setTitle}
                  />

                  <FormCanvas
                    fields={fields}
                    onSelect={setSelectedId}
                    selectedId={selectedId}
                    onRemove={removeField}
                    onAddFieldFromDrag={addField}
                    onReorder={setFields}
                  />

                  <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
                    <h3>Properties</h3>
                    {selectedId ? (
                      <FieldRenderer
                        field={fields.find((f) => f.id === selectedId)}
                        onChange={(patch) => updateField(selectedId, patch)}
                      />
                    ) : (
                      <div style={{ color: "#666" }}>Select a field to edit properties</div>
                    )}
                  </div>
                </main>

                <section style={{ padding: "20px", borderTop: "1px solid #eee", background: "#fafafa" }}>
                  <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600, color: "#333" }}>
                    Live Preview
                  </h2>
                  <LivePreview fields={fields} title={title} />
                </section>
              </>
            ) : (
              <FormList onEditForm={editForm} />
            )}
          </div>
        </DndContext>
      } />
    </Routes>
  );
}
