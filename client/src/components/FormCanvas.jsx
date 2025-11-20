export default function FormCanvas({ fields = [], onSelect, selectedId, onRemove }) {
    return (
      <div>
        <div style={{ marginBottom: 12, color: "#666" }}>Canvas</div>
  
        <div style={{ minHeight: 300, border: "2px dashed #eee", borderRadius: 8, padding: 12, background: "#fff" }}>
          {fields.length === 0 && (
            <div style={{ textAlign: "center", color: "#999", paddingTop: 60 }}>Drag fields here — or use Add Field buttons.</div>
          )}
  
          {fields.map((f, idx) => (
            <div
              key={f.id}
              onClick={() => onSelect(f.id)}
              style={{
                padding: 12,
                borderRadius: 6,
                marginBottom: 10,
                cursor: "pointer",
                background: selectedId === f.id ? "#e8f0ff" : "#fafafa",
                border: selectedId === f.id ? "1px solid #7da7ff" : "1px solid #eee"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{idx + 1}. {f.label}</strong>
                  <div style={{ color: "#666", fontSize: 13 }}>{fieldPreviewText(f)}</div>
                </div>
  
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={(e) => { e.stopPropagation(); onRemove(f.id); }} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#d00" }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
  