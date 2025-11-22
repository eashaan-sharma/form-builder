import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listForms } from "../api/forms";

export default function FormList({ onEditForm }) {
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

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Loading forms...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#d00" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: "#333", margin: 0 }}>
          My Forms
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
          }}
        >
          Dashboard
        </button>
      </div>
      
      {forms.length === 0 ? (
        <div style={{ 
          padding: "60px 20px", 
          textAlign: "center", 
          color: "#999",
          background: "#fafafa",
          borderRadius: 8,
          border: "1px solid #eee"
        }}>
          <p style={{ fontSize: 16, marginBottom: 8 }}>No forms yet</p>
          <p style={{ fontSize: 14 }}>Create your first form to get started!</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "16px" 
        }}>
          {forms.map((form) => (
            <div
              key={form.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: "20px",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
              }}
            >
              <h3 style={{ 
                margin: "0 0 12px 0", 
                fontSize: 18, 
                fontWeight: 600,
                color: "#333"
              }}>
                {form.title || "Untitled Form"}
              </h3>
              
              {form.createdAt && (
                <p style={{ 
                  margin: "0 0 16px 0", 
                  fontSize: 13, 
                  color: "#666" 
                }}>
                  Created: {formatDate(form.createdAt)}
                </p>
              )}
              
              <button
                onClick={() => onEditForm(form.id)}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  borderRadius: 6,
                  background: "#0b79f7",
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
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
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

