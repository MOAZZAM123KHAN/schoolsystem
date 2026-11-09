// 3 sample students so you can see the app working straight away.
// They are clearly marked SAMPLE (name starts with "SAMPLE" and isSample is true).
// Delete them any time from the Students page.
//
// Marks are stored per subject id as [halfYearly I, halfYearly II Pract., annual I, annual II Pract.].
// Subject ids s1..s6 match the default subjects in settingsService.
// Half-yearly marks are stored for reference only; results use annual marks only.

const base = {
  village: "MANI KALAN",
  post: "MANI KALAN",
  district: "JAUNPUR",
  state: "UTTAR PRADESH",
  photo: "",
  isSample: true,
};

export const sampleStudents = [
  {
    ...base,
    id: "sample-1",
    name: "SAMPLE - Aarav Kumar",
    father: "Sample Father One",
    mother: "Sample Mother One",
    cls: "9TH",
    roll: "01",
    dob: "2011-05-14",
    sr: "S-1001",
    // Passes every subject, strong result (First division)
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
    ...base,
    id: "sample-2",
    name: "SAMPLE - Sana Khan",
    father: "Sample Father Two",
    mother: "Sample Mother Two",
    cls: "9TH",
    roll: "02",
    dob: "2011-09-02",
    sr: "S-1002",
    // Passes every subject, middling result (Second division)
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
    ...base,
    id: "sample-3",
    name: "SAMPLE - Rohit Yadav",
    father: "Sample Father Three",
    mother: "Sample Mother Three",
    cls: "10TH",
    roll: "01",
    dob: "2010-12-21",
    sr: "S-1003",
    // Fails English (annual 20 of 100), so the result is FAIL
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

