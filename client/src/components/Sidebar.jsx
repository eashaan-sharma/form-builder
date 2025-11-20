export default function Sidebar({ onAdd, onSave, title, setTitle }) {
    const btn = (txt, type) => (
      <button
        onClick={() => onAdd(type)}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: 8,
          borderRadius: 6,
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer"
        }}
      >
        {txt}
      </button>
    );
  
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
          {btn("Single-line Text", "text")}
          {btn("Checkbox", "checkbox")}
          {btn("Dropdown / Select", "select")}
          {btn("Number", "number")}
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
  