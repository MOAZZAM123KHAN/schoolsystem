const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    father: { type: String, default: "", trim: true },
    mother: { type: String, default: "", trim: true },
    cls: { type: String, required: true, trim: true },
    roll: { type: String, default: "", trim: true },
    dob: { type: String, default: "" },
    sr: { type: String, default: "", trim: true },
    village: { type: String, default: "", trim: true },
    post: { type: String, default: "", trim: true },
    district: { type: String, default: "JAUNPUR", trim: true },
    state: { type: String, default: "UTTAR PRADESH", trim: true },
    photo: { type: String, default: "" },
    marks: { type: mongoose.Schema.Types.Mixed, default: {} },
    isSample: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Student", studentSchema);
