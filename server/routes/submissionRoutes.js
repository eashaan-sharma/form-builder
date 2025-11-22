import express from "express";
import Submission from "../models/Submission.js";
import Form from "../models/Form.js";

const router = express.Router();

// POST /submissions - Submit a form
router.post("/", async (req, res) => {
  try {
    const { formId, responses } = req.body;
    
    if (!formId || !responses) {
      return res.status(400).json({ error: "formId and responses required" });
    }

    // Validate that form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const submission = new Submission({
      formId,
      responses,
    });
    
    const saved = await submission.save();
    
    res.json({ 
      success: true, 
      id: saved._id.toString() 
    });
  } catch (error) {
    console.error("Error saving submission:", error);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

// GET /submissions/:formId - Get all submissions for a form
router.get("/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    
    const submissions = await Submission.find({ formId })
      .sort({ createdAt: -1 });
    
    res.json(submissions.map(sub => ({
      id: sub._id.toString(),
      formId: sub.formId,
      responses: sub.responses,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    })));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;

