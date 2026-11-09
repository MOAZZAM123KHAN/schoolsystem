const express = require("express");
const Settings = require("../models/Settings");
const requireAuth = require("../middleware/auth");

const router = express.Router();

async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: "global" });
  if (!settings) {
    settings = await Settings.create({ key: "global" });
  }
  return settings;
}

// GET /api/settings
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({
      school: settings.school,
      subjects: settings.subjects,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings
router.put("/", requireAuth, async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    if (req.body.school) settings.school = req.body.school;
    if (req.body.subjects) settings.subjects = req.body.subjects;
    await settings.save();

    res.json({
      school: settings.school,
      subjects: settings.subjects,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings/school
router.put("/school", requireAuth, async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    settings.school = req.body;
    await settings.save();
    res.json(settings.school);
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings/subjects
router.put("/subjects", requireAuth, async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    settings.subjects = req.body;
    await settings.save();
    res.json(settings.subjects);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

