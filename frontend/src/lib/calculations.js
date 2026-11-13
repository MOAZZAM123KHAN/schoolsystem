/**
 * calculations.js — centralized report card calculation engine.
 *
 * TWO-STAGE MARKS RULES:
 * STAGE 1 (Half Yearly):
 *   - Active when NO annual marks (I or II Pract.) are entered across all subjects.
 *   - Half Yearly Total = I + II Pract.
 *   - % age, Division and Result are calculated from Half Yearly marks only.
 *   - Annual and G. Total columns remain empty on the report card.
 *
 * STAGE 2 (Annual / Combined):
 *   - Active when at least one annual mark (I or II Pract.) is entered.
 *   - Annual Total = I + II Pract.
 *   - G. Total M.M. = Half Yearly M.M. + Annual M.M.
 *   - G. Total M.O. = Half Yearly Total + Annual Total.
 *   - % age, Division and Result are calculated from G. Total.
 *
 * COMMON RULES:
 *   - A subject counts only if at least one mark is entered for it.
 *   - Pass mark: 33% in each subject (configurable). Stage 1 checks Half Yearly,
 *     Stage 2 checks G. Total.
 *   - Division: First >= 60%, Second >= 45%, Third otherwise. Any subject fail = FAIL.
 *   - Position in Class is NEVER calculated. Always left empty for manual entry.
 */

export const HALF_I = 0;
export const HALF_II = 1;
export const ANNUAL_I = 2;
export const ANNUAL_II = 3;

export const FIRST_DIVISION_PERCENT = 60;
export const SECOND_DIVISION_PERCENT = 45;
export const DEFAULT_PASS_PERCENT = 33;

/** True when the value has text typed in it. */
export function isFilled(v) {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

/** Converts text to non-negative number. Empty or NaN returns 0. */
export function toNumber(v) {
  const x = parseFloat(v);
  return Number.isNaN(x) ? 0 : Math.max(0, x);
}

/** Formats numbers rounded to 2 decimal places ("72", "66.67"). */
export function formatNumber(n) {
  return String(Math.round(n * 100) / 100);
}

/** Normalized comparison for class names. */
export function classKey(cls) {
  return String(cls || "").trim().toUpperCase();
}

/** Extracts mark array [hI, hII, aI, aII] for a subject. */
export function marksOf(student, subjectId) {
  const m = (student && student.marks && student.marks[subjectId]) || [];
  return [m[0] ?? "", m[1] ?? "", m[2] ?? "", m[3] ?? ""];
}

/**
 * Validates if typed marks exceed maximum allowed marks.
 * Used for warnings/field error highlighting.
 */
export function exceedsMax(pair, maxMarks) {
  const filled = isFilled(pair[0]) || isFilled(pair[1]);
  return filled && toNumber(pair[0]) + toNumber(pair[1]) > toNumber(maxMarks);
}

/**
 * Calculates a student's result based on entered marks and detects Stage 1 or Stage 2.
 *
 * @param {object} student
 * @param {object[]} subjects
 * @param {number} passPercent
 */
export function calculateStudent(student, subjects = [], passPercent = DEFAULT_PASS_PERCENT) {
  const scholasticSubjects = subjects.filter((s) => !s.isGraded);
  const gradedSubjects = subjects.filter((s) => Boolean(s.isGraded));

  // Determine Stage: Stage 2 if ANY annual mark is entered; Stage 1 if none.
  let hasAnyAnnual = false;
  for (const sub of subjects) {
    const m = marksOf(student, sub.id);
    if (isFilled(m[ANNUAL_I]) || isFilled(m[ANNUAL_II])) {
      hasAnyAnnual = true;
      break;
    }
  }

  const stage = hasAnyAnnual ? 2 : 1;

  const totals = {
    hyMM: 0,
    hyI: 0,
    hyII: 0,
    hyTotal: 0,
    annualMM: 0,
    annualI: 0,
    annualII: 0,
    annualTotal: 0,
    grandMM: 0,
    grandMO: 0,
  };

  const rows = [];
  let passed = true;
  let any = false;

  for (const subject of scholasticSubjects) {
    const m = marksOf(student, subject.id);

    const hasHy = isFilled(m[HALF_I]) || isFilled(m[HALF_II]);
    const hasAnnual = isFilled(m[ANNUAL_I]) || isFilled(m[ANNUAL_II]);
    const used = hasHy || hasAnnual;

    const row = {
      subject,
      used,
      hasHy,
      hasAnnual,
      hyI: hasHy ? toNumber(m[HALF_I]) : 0,
      hyII: hasHy ? toNumber(m[HALF_II]) : 0,
      hyTotal: 0,
      hyMM: hasHy ? toNumber(subject.hy) : 0,
      annualI: hasAnnual ? toNumber(m[ANNUAL_I]) : 0,
      annualII: hasAnnual ? toNumber(m[ANNUAL_II]) : 0,
      annualTotal: 0,
      annualMM: hasAnnual ? toNumber(subject.an) : 0,
      grandMM: 0,
      grandMO: 0,
      ok: true,
    };

    if (hasHy) {
      row.hyTotal = row.hyI + row.hyII;
    }

    if (hasAnnual) {
      row.annualTotal = row.annualI + row.annualII;
    }

    if (used) {
      any = true;

      if (stage === 1) {
        // Stage 1: Half yearly only
        row.ok = row.hyMM > 0 ? row.hyTotal >= (row.hyMM * passPercent) / 100 : true;
        if (!row.ok) passed = false;

        totals.hyMM += row.hyMM;
        totals.hyI += row.hyI;
        totals.hyII += row.hyII;
        totals.hyTotal += row.hyTotal;
      } else {
        // Stage 2: Annual combined with Half Yearly
        row.grandMM = row.hyMM + row.annualMM;
        row.grandMO = row.hyTotal + row.annualTotal;

        row.ok = row.grandMM > 0 ? row.grandMO >= (row.grandMM * passPercent) / 100 : true;
        if (!row.ok) passed = false;

        totals.hyMM += row.hyMM;
        totals.hyI += row.hyI;
        totals.hyII += row.hyII;
        totals.hyTotal += row.hyTotal;

        totals.annualMM += row.annualMM;
        totals.annualI += row.annualI;
        totals.annualII += row.annualII;
        totals.annualTotal += row.annualTotal;

        totals.grandMM += row.grandMM;
        totals.grandMO += row.grandMO;
      }
    }

    rows.push(row);
  }

  // Graded subjects (below Total) — displayed in grades (A, B, C), not added to totals
  const gradedRows = [];
  for (const subject of gradedSubjects) {
    const m = marksOf(student, subject.id);
    const hasHy = isFilled(m[HALF_I]);
    const hasAnnual = isFilled(m[ANNUAL_I]) || isFilled(m[ANNUAL_II]);
    const used = hasHy || hasAnnual;

    let hyGrade = String(m[HALF_I] || "").trim().toUpperCase();
    if (!["A", "B", "C"].includes(hyGrade)) hyGrade = "";
    let annualGrade = String(m[ANNUAL_I] || "").trim().toUpperCase();
    if (!["A", "B", "C"].includes(annualGrade)) annualGrade = "";
    let grandGrade = String(m[ANNUAL_II] || m[HALF_II] || annualGrade || hyGrade).trim().toUpperCase();
    if (!["A", "B", "C"].includes(grandGrade)) grandGrade = "";

    gradedRows.push({
      subject,
      used,
      hasHy: Boolean(hyGrade),
      hasAnnual: Boolean(annualGrade),
      hyGrade,
      annualGrade,
      grandGrade,
      scale: "A.B.C.",
    });
  }

  // Calculate percentage and division based on active stage
  let percentage = 0;
  if (any) {
    if (stage === 1) {
      percentage = totals.hyMM > 0 ? (totals.hyTotal / totals.hyMM) * 100 : 0;
    } else {
      percentage = totals.grandMM > 0 ? (totals.grandMO / totals.grandMM) * 100 : 0;
    }
  }

  let division = "";
  if (any) {
    if (!passed) {
      division = "Fail";
    } else if (percentage >= FIRST_DIVISION_PERCENT) {
      division = "First";
    } else if (percentage >= SECOND_DIVISION_PERCENT) {
      division = "Second";
    } else {
      division = "Third";
    }
  }

  return {
    stage,
    rows,
    gradedRows,
    totals,
    any,
    passed,
    percentage,
    division,
    result: !any ? "" : passed ? "PASS" : "FAIL",
    position: "", // Position in Class is never calculated; filled by hand
  };
}

/**
 * Backward-compatible helper for components.
 * Accepts optional (student, allStudents, subjects, passPercent) or (student, subjects, passPercent).
 */
export function fullResult(student, p1, p2, p3) {
  const subjects = Array.isArray(p1) && p1[0]?.hy !== undefined ? p1 : p2;
  const passPercent = typeof p2 === "number" ? p2 : typeof p3 === "number" ? p3 : DEFAULT_PASS_PERCENT;
  return calculateStudent(student, subjects, passPercent);
}
