import { describe, expect, it } from "vitest";
import {
  calculateStudent,
  exceedsMax,
  formatNumber,
  fullResult,
} from "./calculations";

const subjects = [
  { id: "sub1", name: "Hindi", hy: 100, an: 100 },
  { id: "sub2", name: "English", hy: 100, an: 100 },
  { id: "sub3", name: "Mathematics", hy: 100, an: 100 },
];

const student = (id, marks) => ({ id, cls: "9TH", marks });

describe("Stage 1: Half-Yearly only", () => {
  it("calculates results using half-yearly marks when no annual marks are entered", () => {
    const s = student("st1", {
      sub1: ["40", "30", "", ""], // 70 / 100
      sub2: ["35", "25", "", ""], // 60 / 100
      sub3: ["45", "35", "", ""], // 80 / 100
    });

    const res = calculateStudent(s, subjects, 33);
    expect(res.stage).toBe(1);
    expect(res.rows[0].hyTotal).toBe(70);
    expect(res.rows[1].hyTotal).toBe(60);
    expect(res.rows[2].hyTotal).toBe(80);

    // Half yearly totals
    expect(res.totals.hyMM).toBe(300);
    expect(res.totals.hyTotal).toBe(210);

    // Percentage & result
    expect(res.percentage).toBe(70);
    expect(res.division).toBe("First");
    expect(res.result).toBe("PASS");
    expect(res.position).toBe(""); // Always empty for manual entry
  });

  it("fails in Stage 1 when a half-yearly subject is below pass mark", () => {
    const s = student("st2", {
      sub1: ["15", "10", "", ""], // 25 / 100 (< 33%) -> FAIL
      sub2: ["40", "30", "", ""],
      sub3: ["40", "40", "", ""],
    });

    const res = calculateStudent(s, subjects, 33);
    expect(res.stage).toBe(1);
    expect(res.passed).toBe(false);
    expect(res.division).toBe("Fail");
    expect(res.result).toBe("FAIL");
    expect(res.rows[0].ok).toBe(false);
    expect(res.rows[1].ok).toBe(true);
  });
});

describe("Stage 2: Both exams (Annual entered)", () => {
  it("combines Half Yearly and Annual into G. Total when annual marks are entered", () => {
    const s = student("st3", {
      sub1: ["35", "25", "40", "30"], // HY: 60, AN: 70 -> G.Total: 130 / 200
      sub2: ["20", "25", "25", "30"], // HY: 45, AN: 55 -> G.Total: 100 / 200
      sub3: ["30", "30", "35", "35"], // HY: 60, AN: 70 -> G.Total: 130 / 200
    });

    const res = calculateStudent(s, subjects, 33);
    expect(res.stage).toBe(2);
    expect(res.rows[0].annualTotal).toBe(70);
    expect(res.rows[0].grandMM).toBe(200);
    expect(res.rows[0].grandMO).toBe(130);

    // Grand totals across all 3 subjects: 360 / 600 = 60%
    expect(res.totals.grandMM).toBe(600);
    expect(res.totals.grandMO).toBe(360);
    expect(res.percentage).toBe(60);
    expect(res.division).toBe("First");
    expect(res.result).toBe("PASS");
    expect(res.position).toBe("");
  });

  it("division thresholds in Stage 2: First >= 60%, Second >= 45%, Third otherwise", () => {
    const mk = (half, annual) =>
      student("test", {
        sub1: [String(half), "", String(annual), ""],
        sub2: [String(half), "", String(annual), ""],
        sub3: [String(half), "", String(annual), ""],
      });

    // 60 / 100 each -> G.Total 120/200 = 60%
    expect(calculateStudent(mk(60, 60), subjects).division).toBe("First");

    // 45 / 100 each -> G.Total 90/200 = 45%
    expect(calculateStudent(mk(45, 45), subjects).division).toBe("Second");

    // 40 / 100 each -> G.Total 80/200 = 40% (>= 33%)
    expect(calculateStudent(mk(40, 40), subjects).division).toBe("Third");
  });

  it("checks G. Total against pass percentage in Stage 2", () => {
    const s = student("failCase", {
      sub1: ["10", "10", "10", "10"], // G. Total: 40 / 200 = 20% (< 33%) -> FAIL
      sub2: ["40", "40", "40", "40"], // G. Total: 160 / 200 = 80%
      sub3: ["40", "40", "40", "40"],
    });

    const res = calculateStudent(s, subjects, 33);
    expect(res.stage).toBe(2);
    expect(res.passed).toBe(false);
    expect(res.division).toBe("Fail");
    expect(res.result).toBe("FAIL");
    expect(res.rows[0].ok).toBe(false);
  });
});

describe("Special scenarios: Single-exam subject, missing marks, and editing", () => {
  it("subject with only one exam uses only that exam's MM in totals", () => {
    const s = student("singleExamSub", {
      sub1: ["40", "30", "45", "35"], // Both exams: MM 200, MO 150
      sub2: ["30", "20", "", ""],     // Only Half Yearly: MM 100, MO 50
      sub3: ["", "", "40", "40"],     // Only Annual: MM 100, MO 80
    });

    const res = calculateStudent(s, subjects, 33);
    expect(res.stage).toBe(2);

    // sub2 has only HY: grandMM = 100, grandMO = 50
    expect(res.rows[1].grandMM).toBe(100);
    expect(res.rows[1].grandMO).toBe(50);

    // sub3 has only Annual: grandMM = 100, grandMO = 80
    expect(res.rows[2].grandMM).toBe(100);
    expect(res.rows[2].grandMO).toBe(80);

    // Grand totals: 200 + 100 + 100 = 400 MM; 150 + 50 + 80 = 280 MO
    expect(res.totals.grandMM).toBe(400);
    expect(res.totals.grandMO).toBe(280);
    expect(res.percentage).toBe(70);
  });

  it("handles missing/blank marks gracefully as 0 without NaN", () => {
    const s = student("missingMarks", {
      sub1: ["", "", "50", ""],
      sub2: ["", "", "", ""],
      sub3: ["", "", "", ""],
    });

    const res = calculateStudent(s, subjects, 33);
    expect(res.stage).toBe(2);
    expect(res.totals.grandMM).toBe(100);
    expect(res.totals.grandMO).toBe(50);
    expect(res.percentage).toBe(50);
    expect(Number.isNaN(res.percentage)).toBe(false);
  });

  it("editing half-yearly marks after annual is entered recalculates immediately", () => {
    const marks = {
      sub1: ["30", "20", "40", "30"],
      sub2: ["30", "20", "40", "30"],
      sub3: ["30", "20", "40", "30"],
    };

    const initial = calculateStudent(student("editTest", marks), subjects, 33);
    expect(initial.totals.grandMO).toBe(360);

    // Edit half-yearly mark on sub1 from 30 to 45 (+15)
    const updatedMarks = {
      ...marks,
      sub1: ["45", "20", "40", "30"],
    };

    const updated = calculateStudent(student("editTest", updatedMarks), subjects, 33);
    expect(updated.totals.grandMO).toBe(375);
    expect(updated.rows[0].grandMO).toBe(135);
  });

  it("returns empty result if no marks are entered at all", () => {
    const s = student("empty", {});
    const res = calculateStudent(s, subjects, 33);
    expect(res.any).toBe(false);
    expect(res.percentage).toBe(0);
    expect(res.division).toBe("");
    expect(res.result).toBe("");
  });
});

describe("exceedsMax warning helper", () => {
  it("detects when sum of typed marks is greater than maximum marks", () => {
    expect(exceedsMax(["60", "50"], 100)).toBe(true);
    expect(exceedsMax(["50", "50"], 100)).toBe(false);
    expect(exceedsMax(["", ""], 100)).toBe(false);
  });
});
