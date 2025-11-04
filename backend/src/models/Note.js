const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      enum: ["Phone Screen", "Technical", "System Design", "Behavioral", "HR", "On-site", "General"],
      default: "General",
    },
    round: {
      type: String,
      default: "Round 1",
    },
    interviewDate: {
      type: Date,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    questionsAsked: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    learnings: {
      type: String,
    },
    improvements: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);