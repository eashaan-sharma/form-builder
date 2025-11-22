export async function submitForm(payload) {
  const res = await fetch("http://localhost:5000/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to submit form");
  return res.json();
}

