export async function saveForm(payload) {
  const { id, ...data } = payload;
  console.log("Saving payload:", data);
  const url = id 
    ? `http://localhost:5000/forms/${id}`
    : "http://localhost:5000/forms";
  const method = id ? "PUT" : "POST";
  
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

export async function getForm(id) {
  const res = await fetch(`http://localhost:5000/forms/${id}`);
  if (!res.ok) throw new Error("Failed to load form");
  return res.json();
}

export async function listForms() {
  const res = await fetch("http://localhost:5000/forms");
  if (!res.ok) throw new Error("Failed to list forms");
  return res.json();
}

export async function updateForm(id, payload) {
  const res = await fetch(`http://localhost:5000/forms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update form");
  return res.json();
}

export async function submitForm(id, data) {
  const res = await fetch(`http://localhost:5000/forms/${id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data })
  });
  if (!res.ok) throw new Error("Failed to submit form");
  return res.json();
}
  