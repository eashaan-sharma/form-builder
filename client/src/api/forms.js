const BASE = import.meta.env.VITE_API_BASE_URL;

// CREATE or UPDATE
export async function saveForm(payload) {
  const { id, ...data } = payload;

  const url = id ? `${BASE}/forms/${id}` : `${BASE}/forms`;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

// GET single form
export async function getForm(id) {
  const res = await fetch(`${BASE}/forms/${id}`);
  if (!res.ok) throw new Error("Failed to load form");
  return res.json();
}

// LIST forms
export async function listForms() {
  const res = await fetch(`${BASE}/forms`);
  if (!res.ok) throw new Error("Failed to list forms");
  return res.json();
}

// UPDATE form
export async function updateForm(id, payload) {
  const res = await fetch(`${BASE}/forms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to update form");
  return res.json();
}

// SUBMIT response to public form
export async function submitForm(id, data) {
  const res = await fetch(`${BASE}/forms/${id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data })
  });

  if (!res.ok) throw new Error("Failed to submit form");
  return res.json();
}
