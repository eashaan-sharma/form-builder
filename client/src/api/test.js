export async function pingServer() {
    const res = await fetch("http://localhost:5000/");
    const data = await res.json();
    return data.message;  // extract message from JSON
  }
  