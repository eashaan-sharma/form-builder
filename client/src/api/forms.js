export async function saveForm(payload) {
    const res = await fetch("http://localhost:5000/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Save failed");
    return res.json();
  }
  