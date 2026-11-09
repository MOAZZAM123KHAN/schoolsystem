import { describe, expect, it } from "vitest";
import {
  calculateStudent,
  exceedsMax,
  formatNumber,
  fullResult,
  ordinal,
  positionInClass,
} from "./calculations";

const subjects = [
  { id: "a", name: "Hindi", hy: 50, an: 100 },
  { id: "b", name: "English", hy: 50, an: 100 },
  { id: "c", name: "Maths", hy: 50, an: 100 },
];

// marks = [halfI, halfII, annualI, annualII]
const student = (id, cls, marks) => ({ id, cls, marks });

describe("annual marks decide the result", () => {
  it("adds annual I + II per subject and builds G. Total from annual only", () => {
    const s = student("1", "9TH", {
      a: ["10", "", "60", "5"],
      b: ["10", "", "70", ""],
      c: ["10", "", "50", ""],
    });
    const r = calculateStudent(s, subjects, 33);
    expect(r.rows[0].annualTotal).toBe(65);
    expect(r.totals.grandMM).toBe(300);
    expect(r.totals.grandMO).toBe(185);
    expect(formatNumber(r.percentage)).toBe("61.67");
    expect(r.division).toBe("First");
    expect(r.result).toBe("PASS");
  });

  it("division boundaries: 60 First, 45 Second, below Third", () => {
    const mk = (n) => student("x", "9TH", { a: ["", "", String(n), ""], b: ["", "", String(n), ""], c: ["", "", String(n), ""] });
    expect(calculateStudent(mk(60), subjects).division).toBe("First");
    expect(calculateStudent(mk(59), subjects).division).toBe("Second");
    expect(calculateStudent(mk(45), subjects).division).toBe("Second");
    expect(calculateStudent(mk(44), subjects).division).toBe("Third");
    expect(calculateStudent(mk(33), subjects).division).toBe("Third");
  });

  it("fails when any annual subject is below the pass mark", () => {
    const s = student("1", "9TH", { a: ["", "", "90", ""], b: ["", "", "32", ""], c: ["", "", "90", ""] });
    const r = calculateStudent(s, subjects, 33);
    expect(r.passed).toBe(false);
    expect(r.division).toBe("Fail");
    expect(r.result).toBe("FAIL");
  });

  it("pass mark is configurable", () => {
    const s = student("1", "9TH", { a: ["", "", "35", ""], b: ["", "", "35", ""], c: ["", "", "35", ""] });
    expect(calculateStudent(s, subjects, 33).result).toBe("PASS");
    expect(calculateStudent(s, subjects, 40).result).toBe("FAIL");
  });

  it("a subject counts only if an annual mark is entered", () => {
    const s = student("1", "9TH", {
      a: ["", "", "80", ""],
      b: ["40", "", "", ""], // only half-yearly: does NOT count
      c: ["", "", "", ""],
    });
    const r = calculateStudent(s, subjects, 33);
    expect(r.rows[0].used).toBe(true);
    expect(r.rows[1].used).toBe(false);
    expect(r.totals.grandMM).toBe(100);
    expect(r.percentage).toBe(80);
  });

  it("gives an empty result when no annual marks are entered", () => {
    const r = calculateStudent(student("1", "9TH", { a: ["50", "", "", ""] }), subjects);
    expect(r.any).toBe(false);
    expect(r.division).toBe("");
    expect(r.result).toBe("");
  });
});

describe("position in class", () => {
  const list = [
    student("p1", "9TH", { a: ["", "", "90", ""], b: ["", "", "90", ""], c: ["", "", "90", ""] }),
    student("p2", "9th ", { a: ["", "", "70", ""], b: ["", "", "70", ""], c: ["", "", "70", ""] }), // same class, different spelling
    student("p3", "9TH", { a: ["", "", "20", ""], b: ["", "", "95", ""], c: ["", "", "95", ""] }), // failed
    student("p4", "10TH", { a: ["", "", "50", ""], b: ["", "", "50", ""], c: ["", "", "50", ""] }),
  ];

  it("ranks passed students of the same class only", () => {
    expect(positionInClass(list[0], list, subjects)).toBe("1st");
    expect(positionInClass(list[1], list, subjects)).toBe("2nd");
    expect(positionInClass(list[3], list, subjects)).toBe("1st"); // alone in 10TH
  });

  it("failed students get no position and do not push others down", () => {
    expect(positionInClass(list[2], list, subjects)).toBe("—");
  });

  it("equal percentages share a position", () => {
    const tie = [
      student("t1", "9TH", { a: ["", "", "60", ""], b: ["", "", "60", ""], c: ["", "", "60", ""] }),
      student("t2", "9TH", { a: ["", "", "60", ""], b: ["", "", "60", ""], c: ["", "", "60", ""] }),
    ];
    expect(positionInClass(tie[0], tie, subjects)).toBe("1st");
    expect(positionInClass(tie[1], tie, subjects)).toBe("1st");
  });
});

describe("HALF-YEARLY MARKS NEVER CHANGE ANY RESULT", () => {
  const annual = { a: "72", b: "55", c: "48" };
  const withHalf = (half) =>
    student("h", "9TH", {
      a: [half[0], half[1], annual.a, ""],
      b: [half[0], half[1], annual.b, ""],
      c: [half[0], half[1], annual.c, ""],
    });
  const others = (half) => [
    withHalf(half),
    student("o1", "9TH", { a: ["5", "", "60", ""], b: ["5", "", "60", ""], c: ["5", "", "60", ""] }),
  ];

  const variants = [
    ["", ""],
    ["0", "0"],
    ["1", "1"],
    ["25", "25"],
    ["50", "50"],
    ["9999", "9999"], // even nonsense values change nothing
  ];

  it("totals, G. Total, %, division, result and position are identical for any half-yearly marks", () => {
    const baseline = fullResult(withHalf(["", ""]), others(["", ""]), subjects, 33);
    for (const half of variants) {
      const r = fullResult(withHalf(half), others(half), subjects, 33);
      expect(r.totals).toEqual(baseline.totals);
      expect(r.percentage).toBe(baseline.percentage);
      expect(r.division).toBe(baseline.division);
      expect(r.result).toBe(baseline.result);
      expect(r.passed).toBe(baseline.passed);
      expect(r.position).toBe(baseline.position);
      expect(r.rows.map((x) => [x.used, x.annualTotal, x.grandMM, x.grandMO, x.ok])).toEqual(
        baseline.rows.map((x) => [x.used, x.annualTotal, x.grandMM, x.grandMO, x.ok])
      );
    }
  });

  it("another student's half-yearly marks do not change this student's position", () => {
    const me = withHalf(["", ""]);
    const rivalLow = student("r", "9TH", { a: ["0", "", "60", ""], b: ["0", "", "60", ""], c: ["0", "", "60", ""] });
    const rivalHigh = student("r", "9TH", { a: ["50", "50", "60", "" ], b: ["50", "50", "60", ""], c: ["50", "50", "60", ""] });
    expect(positionInClass(me, [me, rivalLow], subjects)).toBe(positionInClass(me, [me, rivalHigh], subjects));
  });

  it("half-yearly marks alone never make a subject count or a student pass", () => {
    const s = student("z", "9TH", { a: ["50", "50", "", ""], b: ["50", "50", "", ""], c: ["50", "50", "", ""] });
    const r = calculateStudent(s, subjects, 33);
    expect(r.any).toBe(false);
    expect(r.totals.grandMO).toBe(0);
    expect(r.result).toBe("");
  });

  it("the calculation never returns any half-yearly total", () => {
    const r = calculateStudent(withHalf(["30", "10"]), subjects, 33);
    // Look only at calculated values (rows echo back the subject settings, which is not a result)
    const calculated = { ...r, rows: r.rows.map(({ subject, ...values }) => values) };
    const text = JSON.stringify(calculated);
    expect(text).not.toMatch(/half/i);
    expect(text).not.toMatch(/hy/i);
  });
});

describe("helpers", () => {
  it("ordinal", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map(ordinal)).toEqual([
      "1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "101st",
    ]);
  });

  it("exceedsMax warns about typing mistakes only", () => {
    expect(exceedsMax(["60", "50"], 100)).toBe(true);
    expect(exceedsMax(["60", "40"], 100)).toBe(false);
    expect(exceedsMax(["", ""], 100)).toBe(false);
  });
});
