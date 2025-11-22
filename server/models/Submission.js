import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
  },
  responses: [
    {
      fieldId: {
        type: String,
        required: true,
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  ],
}, {
  timestamps: true,
});

export default mongoose.model("Submission", submissionSchema);

