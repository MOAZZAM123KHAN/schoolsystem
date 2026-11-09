const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, trim: true },
    className: { type: String, trim: true },
    section: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    dob: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);

