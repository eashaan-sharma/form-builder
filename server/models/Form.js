import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["text", "number", "checkbox", "select"],
  },
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  options: {
    type: [String],
    default: [],
  },
}, { _id: false }); // <-- IMPORTANT: prevents automatic nested _id fields

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fields: {
      type: [fieldSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Form", formSchema);
