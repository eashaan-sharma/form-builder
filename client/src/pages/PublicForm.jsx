import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForm } from "../api/forms";
import { submitForm } from "../api/submissions";

export default function PublicForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      try {
        setLoading(true);
        const formData = await getForm(id);
        setForm(formData);
        setError(null);
      } catch (err) {
        console.error("Failed to load form:", err);
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchForm();
    }
  }, [id]);

  function handleChange(fieldId, value) {
    setValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Build responses array from values
      const responses = Object.entries(values).map(([fieldId, value]) => ({
        fieldId,
        value
      }));
      
      await submitForm({ formId: id, responses });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit form:", err);
      setError("Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function renderField(field) {
    const commonProps = {
      id: field.id,
      name: field.id,
      required: field.required || false,
      placeholder: field.placeholder || "",
      value: values[field.id] || (field.type === "checkbox" ? false : ""),
      onChange: (e) => {
        const value = field.type === "checkbox" ? e.target.checked : e.target.value;
        handleChange(field.id, value);
      },
      disabled: submitted
    };

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} style={{ marginBottom: 20 }}>
            <label htmlFor={field.id} style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
              {field.label || "Untitled"}
              {field.required && <span style={{ color: "#d00", marginLeft: 4 }}>*</span>}
            </label>
            <input
              type="text"
              {...commonProps}
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
          <div key={field.id} style={{ marginBottom: 20 }}>
            <label htmlFor={field.id} style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
              {field.label || "Untitled"}
              {field.required && <span style={{ color: "#d00", marginLeft: 4 }}>*</span>}
            </label>
            <input
              type="number"
              {...commonProps}
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
          <div key={field.id} style={{ marginBottom: 20 }}>
            <label htmlFor={field.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              <input
                type="checkbox"
                {...commonProps}
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
          <div key={field.id} style={{ marginBottom: 20 }}>
            <label htmlFor={field.id} style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
              {field.label || "Select"}
              {field.required && <span style={{ color: "#d00", marginLeft: 4 }}>*</span>}
            </label>
            <select
              {...commonProps}
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

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666", fontFamily: "system-ui, sans-serif" }}>
        Loading form...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#d00", fontFamily: "system-ui, sans-serif" }}>
        {error}
      </div>
    );
  }

  if (!form) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666", fontFamily: "system-ui, sans-serif" }}>
        Form not found
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ 
        maxWidth: "600px", 
        margin: "60px auto", 
        padding: "40px", 
        textAlign: "center",
        background: "#f0f7ff",
        borderRadius: 8,
        border: "1px solid #7da7ff"
      }}>
        <h2 style={{ marginBottom: 16, fontSize: 24, fontWeight: 600, color: "#333" }}>
          Submitted successfully!
        </h2>
        <p style={{ fontSize: 16, color: "#666" }}>
          Thank you for your submission.
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "40px auto", 
      padding: "20px",
      fontFamily: "system-ui, sans-serif"
    }}>
      <h1 style={{ marginBottom: 24, fontSize: 28, fontWeight: 600, color: "#333" }}>
        {form.title || "Untitled Form"}
      </h1>

      <form onSubmit={handleSubmit}>
        {(form.fields || []).map(renderField)}

        <button
          type="submit"
          disabled={submitting || submitted}
          style={{
            width: "100%",
            padding: "12px 24px",
            marginTop: 20,
            borderRadius: 6,
            background: (submitting || submitted) ? "#ccc" : "#0b79f7",
            color: "#fff",
            border: "none",
            fontSize: 16,
            fontWeight: 500,
            cursor: (submitting || submitted) ? "not-allowed" : "pointer",
            transition: "background 0.2s ease"
          }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

