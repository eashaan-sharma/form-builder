import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listSubmissions } from "../api/dashboard";
import { getForm } from "../api/forms";

export default function Submissions() {
  const { id: formId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [submissionsData, formData] = await Promise.all([
          listSubmissions(formId),
          getForm(formId)
        ]);
        setSubmissions(submissionsData);
        setForm(formData);
        setError(null);
      } catch (err) {
        console.error("Failed to load submissions:", err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }
    if (formId) {
      fetchData();
    }
  }, [formId]);

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  }

  function getFieldLabel(fieldId) {
    if (!form || !form.fields) return fieldId;
    const field = form.fields.find(f => f.id === fieldId);
    return field ? field.label : fieldId;
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666", fontFamily: "system-ui, sans-serif" }}>
        Loading submissions...
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

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 24, fontSize: 28, fontWeight: 600, color: "#333" }}>
        Submissions {form && `- ${form.title}`}
      </h1>

      {submissions.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
          No submissions yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {submissions.map((submission, idx) => (
            <div
              key={submission.id || idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: "16px",
                background: "#fff"
              }}
            >
              <div style={{ marginBottom: "12px", fontSize: 12, color: "#666" }}>
                Submitted: {formatDate(submission.createdAt)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {submission.responses && submission.responses.map((response, rIdx) => (
                  <div key={rIdx} style={{ padding: "8px", background: "#f9f9f9", borderRadius: 4 }}>
                    <strong style={{ fontSize: 13, color: "#333" }}>
                      {getFieldLabel(response.fieldId)}:
                    </strong>
                    <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
                      {response.value !== null && response.value !== undefined 
                        ? String(response.value) 
                        : "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

