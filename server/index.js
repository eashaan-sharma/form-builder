import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for testing (replace with DB later)
const FORMS = {}; // id -> { id, title, fields, createdAt }

app.get("/", (req, res) => {
  res.json({ message: "Backend is running, Eashaan" });
});

// Save form
app.post("/api/forms", (req, res) => {
  const { title, fields } = req.body;
  if (!title || !fields) return res.status(400).json({ error: "title and fields required" });

  const id = Date.now().toString(36);
  const doc = { id, title, fields, createdAt: new Date().toISOString() };
  FORMS[id] = doc;

  res.json({ id, success: true });
});

// Get a form
app.get("/api/forms/:id", (req, res) => {
  const doc = FORMS[req.params.id];
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json(doc);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
