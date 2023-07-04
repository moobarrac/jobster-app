const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please add a company"],
      maxlength: [50, "Company name cannot be more than 50 characters"],
    },
    position: {
      type: String,
      required: [true, "Please add a position"],
      maxlength: [200, "Position name cannot be more than 200 characters"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a user"],
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "my city",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
