/**
 * calculations.js — every result calculation lives here and nowhere else.
 *
 * THE KEY RULE:
 *   HALF-YEARLY marks are for STORAGE ONLY. They are never read by any function
 *   that produces a total, G. Total, percentage, division, position, pass/fail
 *   or result. Only ANNUAL marks (I and II Pract.) are used.
 *   The only function that looks at half-yearly marks is `exceedsMax`, which just
 *   warns about a typing mistake (marks bigger than the maximum); it does not
 *   change any result.
 *
 * Marks for one student are stored per subject id as 4 strings:
 *   [halfYearly I, halfYearly II Pract., annual I, annual II Pract.]
 * Index constants below make this readable.
 */

export const HALF_I = 0;
export const HALF_II = 1;
export const ANNUAL_I = 2;
export const ANNUAL_II = 3;

export const FIRST_DIVISION_PERCENT = 60;
export const SECOND_DIVISION_PERCENT = 45;
export const DEFAULT_PASS_PERCENT = 33;

/** True when the box has something typed in it. */
export function isFilled(v) {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

/** Turn typed text into a number. Empty or invalid text counts as 0; never negative. */
export function toNumber(v) {
  const x = parseFloat(v);
  return Number.isNaN(x) ? 0 : Math.max(0, x);
}

/** Round to 2 decimals and show as text (72 -> "72", 66.666 -> "66.67"). */
export function formatNumber(n) {
  return String(Math.round(n * 100) / 100);
}

/** 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 11 -> "11th" */
export function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Class names are compared ignoring case and spaces ("9th " equals "9TH"). */
export function classKey(cls) {
  return String(cls || "").trim().toUpperCase();
}

function marksOf(student, subjectId) {
  const m = (student.marks && student.marks[subjectId]) || [];
  return [m[0] ?? "", m[1] ?? "", m[2] ?? "", m[3] ?? ""];
}

/**
 * Warning helper for the entry screen only: is a typed total above the maximum?
 * Never used for results.
 * @param {string[]} pair  the two typed marks (I and II Pract.) of one exam
 */
export function exceedsMax(pair, maxMarks) {
  const filled = isFilled(pair[0]) || isFilled(pair[1]);
  return filled && toNumber(pair[0]) + toNumber(pair[1]) > toNumber(maxMarks);
}

/**
 * Calculate one student's result from ANNUAL marks only.
 *
 * @param {object} student        { marks: { [subjectId]: [hI, hII, aI, aII] } }
 * @param {object[]} subjects     [{ id, name, hy, an }]   (an = annual maximum marks)
 * @param {number} passPercent    minimum % needed in every annual subject
 * @returns {{
 *   rows: object[], totals: object, any: boolean, passed: boolean,
 *   percentage: number, division: string, result: string
 * }}
 */
export function calculateStudent(student, subjects, passPercent = DEFAULT_PASS_PERCENT) {
  const totals = { annualMM: 0, annualI: 0, annualII: 0, annualTotal: 0, grandMM: 0, grandMO: 0 };
  const rows = [];
  let passed = true;
  let any = false;

  for (const subject of subjects) {
    const m = marksOf(student, subject.id);

    // A subject counts only if at least one ANNUAL mark is entered.
    const used = isFilled(m[ANNUAL_I]) || isFilled(m[ANNUAL_II]);
    const row = { subject, used };

    if (used) {
      any = true;
      const annualI = toNumber(m[ANNUAL_I]);
      const annualII = toNumber(m[ANNUAL_II]);
      const annualTotal = annualI + annualII;
      const annualMM = toNumber(subject.an);

      row.annualI = annualI;
      row.annualII = annualII;
      row.annualTotal = annualTotal;
      row.annualMM = annualMM;
      // G. Total = annual only
      row.grandMM = annualMM;
      row.grandMO = annualTotal;
      row.ok = annualMM ? annualTotal >= (annualMM * passPercent) / 100 : true;
      if (!row.ok) passed = false;

      totals.annualMM += annualMM;
      totals.annualI += annualI;
      totals.annualII += annualII;
      totals.annualTotal += annualTotal;
      totals.grandMM += annualMM;
      totals.grandMO += annualTotal;
    }
    rows.push(row);
  }

  const percentage = totals.grandMM ? (totals.grandMO / totals.grandMM) * 100 : 0;

  let division = "";
  if (any) {
    if (!passed) division = "Fail";
    else if (percentage >= FIRST_DIVISION_PERCENT) division = "First";
    else if (percentage >= SECOND_DIVISION_PERCENT) division = "Second";
    else division = "Third";
  }

  return {
    rows,
    totals,
    any,
    passed,
    percentage,
    division,
    result: !any ? "" : passed ? "PASS" : "FAIL",
  };
}

/**
 * Position in class = rank among PASSED students of the SAME class, by annual
 * percentage. Students with the same percentage share a position.
 *
 * @returns {string} "1st", "2nd"… ; "—" for a failed student; "" when no annual marks
 */
export function positionInClass(student, allStudents, subjects, passPercent = DEFAULT_PASS_PERCENT) {
  const mine = calculateStudent(student, subjects, passPercent);
  if (!mine.any) return "";
  if (!mine.passed) return "—";

  const key = classKey(student.cls);
  const score = (pct) => Math.round(pct * 100);
  let better = 0;
  for (const other of allStudents) {
    if (other.id === student.id || classKey(other.cls) !== key) continue;
    const r = calculateStudent(other, subjects, passPercent);
    if (r.any && r.passed && score(r.percentage) > score(mine.percentage)) better++;
  }
  return ordinal(better + 1);
}

/**
 * Convenience: result + position for one student, ready to show on screen or card.
 */
export function fullResult(student, allStudents, subjects, passPercent = DEFAULT_PASS_PERCENT) {
  return {
    ...calculateStudent(student, subjects, passPercent),
    position: positionInClass(student, allStudents, subjects, passPercent),
  };
}

