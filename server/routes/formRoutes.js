import express from "express";
import Form from "../models/Form.js";
import Submission from "../models/Submission.js";

const router = express.Router();

// POST /forms - Save a new form
router.post("/", async (req, res) => {
  try {
    const { title, fields } = req.body;
    
    if (!title || !fields) {
      return res.status(400).json({ error: "title and fields required" });
    }

    const form = new Form({ title, fields });
    const savedForm = await form.save();
    
    res.json({ id: savedForm._id.toString(), success: true });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ error: "Failed to save form" });
  }
});

// GET /forms - List all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find({}).select("_id title createdAt updatedAt").sort({ createdAt: -1 });
    res.json(forms.map(form => ({
      id: form._id.toString(),
      title: form.title,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    })));
  } catch (error) {
    console.error("Error listing forms:", error);
    res.status(500).json({ error: "Failed to list forms" });
  }
});

// GET /forms/:id - Get a form by ID
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({
      id: form._id.toString(),
      title: form.title,
      fields: form.fields,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    });
  } catch (error) {
    console.error("Error getting form:", error);
    res.status(500).json({ error: "Failed to get form" });
  }
});

// PUT /forms/:id - Update an existing form
router.put("/:id", async (req, res) => {
  try {
    const { title, fields } = req.body;
    
    if (!title || !fields) {
      return res.status(400).json({ error: "title and fields required" });
    }

    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { title, fields },
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({
      id: form._id.toString(),
      title: form.title,
      fields: form.fields,
      updatedAt: form.updatedAt,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Failed to update form" });
  }
});

// POST /forms/:id/submit - Submit a form
router.post("/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: "data required" });
    }

    // Verify form exists
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submission = new Submission({
      formId: id,
      data: data,
    });
    
    const savedSubmission = await submission.save();
    
    res.json({ 
      id: savedSubmission._id.toString(), 
      success: true,
      submittedAt: savedSubmission.createdAt
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

export default router;

