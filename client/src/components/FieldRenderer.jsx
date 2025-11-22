import { useState, useEffect } from "react";

export default function FieldRenderer({ field, onChange }) {
  const [local, setLocal] = useState(field || {});

  useEffect(() => setLocal(field || {}), [field]);

  if (!field) return null;

  function setProp(key, val) {
    setLocal(prev => ({ ...prev, [key]: val }));
    onChange({ [key]: val });
  }

  function updateOption(idx, val) {
    const opts = [...(local.options || [])];
    opts[idx] = val;
    setLocal(prev => ({ ...prev, options: opts }));
    onChange({ options: opts });
  }

  function addOption() {
    const opts = [...(local.options || []), `Option ${ (local.options||[]).length + 1 }`];
    setLocal(prev => ({ ...prev, options: opts }));
    onChange({ options: opts });
  }

  function removeOption(i) {
    const opts = [...(local.options || [])];
    opts.splice(i, 1);
    setLocal(prev => ({ ...prev, options: opts }));
    onChange({ options: opts });
  }

  return (
    <div>
      <label style={{ fontSize: 13, color: "#444", display: "block", marginBottom: 4 }}>Label</label>
      <input 
        value={local.label || ""} 
        onChange={(e) => setProp("label", e.target.value)} 
        style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 4, border: "1px solid #ddd" }} 
      />

      <label style={{ fontSize: 13, color: "#444", display: "block", marginBottom: 4 }}>Required</label>
      <div style={{ marginBottom: 12 }}>
        <input 
          type="checkbox" 
          checked={!!local.required} 
          onChange={(e) => setProp("required", e.target.checked)} 
          style={{ marginRight: 6 }}
        />
        <span style={{ fontSize: 13, color: "#666" }}>Field is required</span>
      </div>

      {(local.type === "text" || local.type === "number" || local.type === "select") && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: "#444", display: "block", marginBottom: 4 }}>Placeholder</label>
          <input 
            value={local.placeholder || ""} 
            onChange={(e) => setProp("placeholder", e.target.value)} 
            placeholder="Enter placeholder text..."
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ddd" }} 
          />
        </div>
      )}

      {local.type === "select" && (
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 13, color: "#444", display: "block", marginBottom: 4 }}>Options</label>
          <div style={{ marginTop: 6 }}>
            {(local.options || []).map((o, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                <input 
                  value={o} 
                  onChange={(e) => updateOption(i, e.target.value)} 
                  style={{ flex: 1, padding: 6, borderRadius: 4, border: "1px solid #ddd" }} 
                  placeholder={`Option ${i + 1}`}
                />
                <button 
                  onClick={() => removeOption(i)} 
                  style={{ 
                    cursor: "pointer", 
                    padding: "6px 12px", 
                    borderRadius: 4, 
                    border: "1px solid #ddd",
                    background: "#fff",
                    color: "#d00"
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              onClick={addOption} 
              style={{ 
                marginTop: 6, 
                padding: "8px 16px", 
                borderRadius: 4, 
                border: "1px solid #ddd",
                background: "#f5f5f5",
                cursor: "pointer"
              }}
            >
              Add option
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
