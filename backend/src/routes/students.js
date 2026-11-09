const express = require("express");
const Student = require("../models/Student");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

// GET /api/students
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// GET /api/students/:id
router.get("/:id", async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// POST /api/students
router.post("/", async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data.id; // Let MongoDB assign _id
    delete data._id;
    delete data.isSample;

    const student = await Student.create(data);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
});

// PUT /api/students/:id
router.put("/:id", async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data.id;
    delete data._id;

    const student = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/students/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted successfully." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
