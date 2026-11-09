const User = require("./models/User");
const Settings = require("./models/Settings");
const Student = require("./models/Student");

const DEFAULT_SUBJECTS = [
  "Hindi",
  "English",
  "Urdu/Sanskrit",
  "Social Science",
  "Civics",
  "H. Science/Maths",
  "Sociology",
  "Economics",
  "History",
  "Education",
  "Drawing",
  "Science",
  "Theology",
].map((name, i) => ({ id: `s${i + 1}`, name, hy: 100, an: 100 }));

const SAMPLE_STUDENTS = [
  {
    name: "SAMPLE - Aarav Kumar",
    father: "Sample Father One",
    mother: "Sample Mother One",
    cls: "9TH",
    roll: "01",
    dob: "2011-05-14",
    sr: "S-1001",
    village: "MANI KALAN",
    post: "MANI KALAN",
    district: "JAUNPUR",
    state: "UTTAR PRADESH",
    photo: "",
    isSample: true,
    marks: {
      s1: ["40", "", "72", ""],
      s2: ["35", "", "68", ""],
      s3: ["42", "", "75", ""],
      s4: ["38", "", "70", ""],
      s5: ["45", "", "80", ""],
      s6: ["30", "", "64", ""],
    },
  },
  {
    name: "SAMPLE - Sana Khan",
    father: "Sample Father Two",
    mother: "Sample Mother Two",
    cls: "9TH",
    roll: "02",
    dob: "2011-09-02",
    sr: "S-1002",
    village: "MANI KALAN",
    post: "MANI KALAN",
    district: "JAUNPUR",
    state: "UTTAR PRADESH",
    photo: "",
    isSample: true,
    marks: {
      s1: ["30", "", "52", ""],
      s2: ["28", "", "49", ""],
      s3: ["33", "", "55", ""],
      s4: ["25", "", "47", ""],
      s5: ["31", "", "51", ""],
      s6: ["27", "", "48", ""],
    },
  },
  {
    name: "SAMPLE - Rohit Yadav",
    father: "Sample Father Three",
    mother: "Sample Mother Three",
    cls: "10TH",
    roll: "01",
    dob: "2010-12-21",
    sr: "S-1003",
    village: "MANI KALAN",
    post: "MANI KALAN",
    district: "JAUNPUR",
    state: "UTTAR PRADESH",
    photo: "",
    isSample: true,
    marks: {
      s1: ["36", "", "60", ""],
      s2: ["12", "", "20", ""],
      s3: ["30", "", "58", ""],
      s4: ["34", "", "61", ""],
      s5: ["29", "", "55", ""],
      s6: ["32", "", "57", ""],
    },
  },
];

async function seedInitialData() {
  try {
    // 1. Seed admin user if no users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const email = (process.env.DEFAULT_EMAIL || "admin@school.com").toLowerCase();
      const password = process.env.DEFAULT_PASSWORD || "ChangeMe@123";
      await User.create({ email, password });
      console.log(`[Seed] Created initial admin account: ${email}`);
    }

    // 2. Seed settings if none exist
    let settings = await Settings.findOne({ key: "global" });
    if (!settings) {
      settings = await Settings.create({
        key: "global",
        school: {
          name: "Dr. WAKEEL NAZEER INTER COLLEGE",
          addr: "MANI KALAN, JAUNPUR (U.P.)",
          title: "PROGRESS REPORT CARD",
          session: "2026-27",
          pass: 33,
          logo: "",
        },
        subjects: DEFAULT_SUBJECTS,
      });
      console.log("[Seed] Created default school and subjects settings.");
    }

    // 3. Seed sample students if no students exist
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany(SAMPLE_STUDENTS);
      console.log("[Seed] Created 3 sample students.");
    }
  } catch (err) {
    console.error("[Seed] Error during seeding:", err.message);
  }
}

module.exports = seedInitialData;

