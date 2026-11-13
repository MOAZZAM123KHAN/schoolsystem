const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    hy: { type: Number, default: 100 },
    an: { type: Number, default: 100 },
    isGraded: { type: Boolean, default: false },
  },
  { _id: false }
);

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Dr. WAKEEL NAZEER INTER COLLEGE" },
    addr: { type: String, default: "MANI KALAN, JAUNPUR (U.P.)" },
    title: { type: String, default: "PROGRESS REPORT CARD" },
    session: { type: String, default: "2026-27" },
    pass: { type: Number, default: 33 },
    logo: { type: String, default: "" },
    showPractical: { type: Boolean, default: true },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },
    school: { type: schoolSchema, default: () => ({}) },
    subjects: { type: [subjectSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

