const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    type: {
      type: String,
      enum: ["follow-up", "interview-prep", "deadline", "thank-you", "custom"],
      default: "custom",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    alertDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // ✅ Make sure these two fields exist
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Alert || mongoose.model("Alert", alertSchema);