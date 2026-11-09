// 3 sample students demonstrating both Stage 1 and Stage 2:
// - Aarav Kumar: Stage 2 (Both Half Yearly and Annual entered -> First division PASS)
// - Sana Khan: Stage 1 (Half Yearly only -> Stage 1 results, Annual/G.Total columns empty)
// - Rohit Yadav: Stage 2 (Fails English G. Total -> FAIL)

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
    // Stage 2: Both exams entered (First division PASS)
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
    // Stage 1: Half-Yearly only (Annual and G. Total empty on card)
    marks: {
      s1: ["38", "25", "", ""],
      s2: ["35", "25", "", ""],
      s3: ["40", "30", "", ""],
      s4: ["32", "20", "", ""],
      s5: ["36", "24", "", ""],
      s6: ["30", "20", "", ""],
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
    // Stage 2: Fails English G. Total (< 33% of 200 = 66) -> Result FAIL
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
