import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listForms } from "../api/dashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchForms() {
      try {
        setLoading(true);
        const formsList = await listForms();
        setForms(formsList);
        setError(null);
      } catch (err) {
        console.error("Failed to load forms:", err);
        setError("Failed to load forms");
      } finally {
        setLoading(false);
      }
    }
    fetchForms();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  }

  function handleEdit(formId) {
    navigate(`/?id=${formId}`);
  }

  function handleOpenPublic(formId) {
    window.open(`/forms/${formId}`, '_blank');
  }

  function handleSubmissions(formId) {
    navigate(`/forms/${formId}/submissions`);
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666", fontFamily: "system-ui, sans-serif" }}>
        Loading forms...
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
        Dashboard
      </h1>

      {forms.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
          No forms yet
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Title</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Created</th>
              <th style={{ padding: "12px", textAlign: "left", border: "1px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{form.title || "Untitled"}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{formatDate(form.createdAt)}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(form.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 4,
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 13
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenPublic(form.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 4,
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 13
                      }}
                    >
                      Open Public
                    </button>
                    <button
                      onClick={() => handleSubmissions(form.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 4,
                        border: "1px solid #ddd",
                        background: "#fff",
                        cursor: "pointer",
                        fontSize: 13
                      }}
                    >
                      Submissions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

