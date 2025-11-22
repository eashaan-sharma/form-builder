export async function listForms() {
  const res = await fetch("http://localhost:5000/forms");
  if (!res.ok) throw new Error("Failed to list forms");
  return res.json();
}

export async function listSubmissions(formId) {
  const res = await fetch(`http://localhost:5000/submissions/${formId}`);
  if (!res.ok) throw new Error("Failed to list submissions");
  return res.json();
}

