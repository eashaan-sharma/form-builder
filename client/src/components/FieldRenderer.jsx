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
      <label style={{ fontSize: 13, color: "#444" }}>Label</label>
      <input value={local.label || ""} onChange={(e) => setProp("label", e.target.value)} style={{ width: "100%", padding: 8, marginTop: 6, marginBottom: 10 }} />

      <label style={{ fontSize: 13, color: "#444" }}>Required</label>
      <div style={{ marginTop: 6, marginBottom: 10 }}>
        <input type="checkbox" checked={!!local.required} onChange={(e) => setProp("required", e.target.checked)} />
      </div>

      {local.type === "select" && (
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 13, color: "#444" }}>Options</label>
          <div style={{ marginTop: 6 }}>
            {(local.options || []).map((o, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <input value={o} onChange={(e) => updateOption(i, e.target.value)} style={{ flex: 1, padding: 6 }} />
                <button onClick={() => removeOption(i)} style={{ cursor: "pointer" }}>Remove</button>
              </div>
            ))}
            <button onClick={addOption} style={{ marginTop: 6 }}>Add option</button>
          </div>
        </div>
      )}
    </div>
  );
}
