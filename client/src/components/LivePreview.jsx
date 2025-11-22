import { useState } from "react";

export default function LivePreview({ fields = [], title = "Untitled form" }) {
  const [formData, setFormData] = useState({});

  function handleChange(fieldId, value) {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted! Check console for data.");
  }

  function renderField(field) {
    const commonProps = {
      id: field.id,
      name: field.id,
      required: field.required || false,
      placeholder: field.placeholder || "",
    };

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} style={{ marginBottom: 16 }}>
            <label 
              htmlFor={field.id} 
              style={{ 
                display: "block", 
                marginBottom: 6, 
                fontSize: 14, 
                fontWeight: 500,
                color: "#333"
              }}
            >
              {field.label || "Untitled"}
              {field.required && <span style={{ color: "#d00", marginLeft: 4 }}>*</span>}
            </label>
            <input
              type="text"
              {...commonProps}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 14,
                fontFamily: "inherit"
              }}
            />
          </div>
        );

      case "number":
        return (
          <div key={field.id} style={{ marginBottom: 16 }}>
            <label 
              htmlFor={field.id} 
              style={{ 
                display: "block", 
                marginBottom: 6, 
                fontSize: 14, 
                fontWeight: 500,
                color: "#333"
              }}
            >
              {field.label || "Untitled"}
              {field.required && <span style={{ color: "#d00", marginLeft: 4 }}>*</span>}
            </label>
            <input
              type="number"
              {...commonProps}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 14,
                fontFamily: "inherit"
              }}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} style={{ marginBottom: 16 }}>
            <label 
              htmlFor={field.id} 
              style={{ 
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                fontWeight: 500,
                color: "#333",
                cursor: "pointer"
              }}
            >
              <input
                type="checkbox"
                {...commonProps}
                checked={formData[field.id] || false}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  cursor: "pointer"
                }}
              />
              <span>
                {field.label || "Checkbox"}
                {field.required && <span style={{ color: "#d00", marginLeft: 4 }}>*</span>}
              </span>
            </label>
          </div>
        );

      case "select":
        return (
          <div key={field.id} style={{ marginBottom: 16 }}>
            <label 
              htmlFor={field.id} 
              style={{ 
                display: "block", 
                marginBottom: 6, 
                fontSize: 14, 
                fontWeight: 500,
                color: "#333"
              }}
            >
              {field.label || "Select"}
              {field.required && <span style={{ color: "#d00", marginLeft: 4 }}>*</span>}
            </label>
            <select
              {...commonProps}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 14,
                fontFamily: "inherit",
                background: "#fff",
                cursor: "pointer"
              }}
            >
              <option value="">{field.placeholder || "Select an option..."}</option>
              {(field.options || []).map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div style={{ 
      border: "1px solid #eee", 
      padding: 20, 
      borderRadius: 8,
      background: "#fff",
      maxWidth: 600,
      margin: "0 auto"
    }}>
      <h2 style={{ 
        marginBottom: 20, 
        fontSize: 24, 
        fontWeight: 600,
        color: "#333",
        borderBottom: "2px solid #eee",
        paddingBottom: 12
      }}>
        {title}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {fields.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            color: "#999", 
            padding: "40px 20px",
            fontSize: 14
          }}>
            No fields added yet. Add fields to see the preview.
          </div>
        ) : (
          fields.map(renderField)
        )}

        {fields.length > 0 && (
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 24px",
              marginTop: 20,
              borderRadius: 6,
              background: "#0b79f7",
              color: "#fff",
              border: "none",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0a6ae6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0b79f7";
            }}
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
}

