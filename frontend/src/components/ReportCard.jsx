import { useLayoutEffect, useRef } from "react";
import "./reportCard.css";
import DEFAULT_LOGO from "../assets/logo";
import { formatNumber, fullResult, isFilled } from "../lib/calculations";

// Column widths (mm)
// Full 12-column card including practical (II Pract.)
const COLS_WITH_PRACTICAL = [33, 12, 15, 15, 15, 12, 15, 15, 15, 13, 15, 23];
// 10-column card without practical (II Pract.) — widths redistributed across subjects and marks
const COLS_WITHOUT_PRACTICAL = [42, 13, 18, 18, 13, 18, 18, 15, 18, 25];

/** "2011-05-14" -> "14-05-2011" */
function formatDate(d) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || "");
  return m ? `${m[3]}-${m[2]}-${m[1]}` : d || "";
}

function Field({ label, value, wide }) {
  return (
    <div className={`f${wide ? " w2" : ""}`}>
      <b>{label}</b>
      <span>{value}</span>
    </div>
  );
}

/**
 * Progress Report Card (A4 sheet).
 *
 * TWO STAGES:
 * STAGE 1 (Half Yearly):
 *   - Only Half Yearly marks entered.
 *   - Half Yearly Total = I + II Pract.
 *   - Annual and G. Total columns stay empty.
 *   - Remarks (% age, Div., Result) based on Half Yearly marks only.
 *   - Position in Class stays empty.
 *
 * STAGE 2 (Annual):
 *   - Both Half Yearly and Annual marks entered.
 *   - G. Total = Half Yearly + Annual.
 *   - Remarks based on G. Total and combined % age.
 *   - Position in Class stays empty.
 *
 * FONT RULE:
 *   - All M.M. cells (Half Yearly, Annual, G. Total, and Total row) use
 *     td.mm (normal font weight, light grey #777).
 *   - Obtained marks and their totals use td.n (dark and bold).
 */
export default function ReportCard({
  student,
  subjects,
  school,
  allStudents,
  showPractical,
}) {
  const nameRef = useRef(null);

  const hasPractical =
    showPractical !== undefined ? Boolean(showPractical) : school?.showPractical !== false;
  const cols = hasPractical ? COLS_WITH_PRACTICAL : COLS_WITHOUT_PRACTICAL;

  // Shrink a long school name until it fits on one line
  useLayoutEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    let size = 46;
    el.style.fontSize = `${size}px`;
    while (el.scrollWidth > el.clientWidth && size > 14) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  }, [school.name]);

  const r = fullResult(student, subjects, Number(school.pass));
  const isStage2 = r.stage === 2;
  const n = r.rows.length;
  const rowCount = n + 1; // subject rows + Total row

  // Remarks column: 4 stacked sections (% age, Div., Position in Class, Result)
  const groups = [
    ["% age", r.any ? `${formatNumber(r.percentage)}%` : ""],
    ["Div.", r.division],
    ["Position in Class", ""], // Always left empty for manual filling
    ["Result", r.result],
  ];

  const base = Math.floor(rowCount / 4);
  const extra = rowCount % 4;
  const remarkAt = {};
  let at = 0;
  groups.forEach((g, i) => {
    const span = base + (i < extra ? 1 : 0);
    if (span > 0) {
      remarkAt[at] = { label: g[0], value: g[1], span };
      at += span;
    }
  });

  const remarkCell = (i) => {
    const g = remarkAt[i];
    return g ? (
      <td className="rm" rowSpan={g.span}>
        <small>{g.label}</small>
        <strong>{g.value}</strong>
      </td>
    ) : null;
  };

  return (
    <div className="rc">
      <div className="strip" />
      <div className="strip thin" />

      <div className="hd">
        {school.logo || DEFAULT_LOGO ? (
          <img src={school.logo || DEFAULT_LOGO} alt="School logo" />
        ) : null}
        <div className="t">
          <span className="sc-name" ref={nameRef}>
            {school.name}
          </span>
          <div className="sc-addr">{school.addr}</div>
        </div>
      </div>

      <div className="bar">{school.title}</div>

      <div className="info">
        <div className="photo">
          {student.photo ? (
            <img src={student.photo} alt="" />
          ) : (
            <>
              Paste
              <br />
              photo
            </>
          )}
        </div>
        <div className="fields">
          <Field label="Scholar's Name:" value={student.name} wide />
          <Field label="Father's Name Mr.:" value={student.father} wide />
          <Field label="Mother's Name Mrs.:" value={student.mother} wide />
          <Field label="Class:" value={student.cls} />
          <Field label="Roll No.:" value={student.roll} />
          <Field label="Date of Birth:" value={formatDate(student.dob)} />
          <Field label="S.R. No.:" value={student.sr} />
          <Field label="Address Village:" value={student.village} />
          <Field label="Post:" value={student.post} />
          <Field label="District:" value={student.district} />
          <Field label="State:" value={student.state} />
        </div>
      </div>

      {/* Banner always reads "Mark Sheet- <session>" in both stages */}
      <div className="banner">Mark Sheet- {school.session}</div>

      <table>
        <colgroup>
          {cols.map((w, i) => (
            <col key={i} style={{ width: `${w}mm` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="hr" rowSpan={2}>
              Subject
            </th>
            <th className="hb" colSpan={hasPractical ? 4 : 3}>
              Half Yearly Exam.
            </th>
            <th className="hb" colSpan={hasPractical ? 4 : 3}>
              Annual Exam.
            </th>
            <th className="hb" colSpan={2}>
              G. Total
            </th>
            <th className="hr" rowSpan={2} style={{ fontSize: 14 }}>
              Remarks
            </th>
          </tr>
          <tr>
            <th className="hs">M.M.</th>
            <th className="hs">I</th>
            {hasPractical && (
              <th className="hs">
                II
                <br />
                Pract.
              </th>
            )}
            <th className="hs">Total</th>
            <th className="hs">M.M.</th>
            <th className="hs">I</th>
            {hasPractical && (
              <th className="hs">
                II
                <br />
                Pract.
              </th>
            )}
            <th className="hs">Total</th>
            <th className="hs">M.M.</th>
            <th className="hs">M.O.</th>
          </tr>
        </thead>
        <tbody>
          {r.rows.map((row, i) => {
            const m = (student.marks && student.marks[row.subject.id]) || [];
            const hyI = isFilled(m[0]) ? row.hyI : "";
            const hyII = isFilled(m[1]) ? row.hyII : "";
            const anI = isFilled(m[2]) ? row.annualI : "";
            const anII = isFilled(m[3]) ? row.annualII : "";

            return (
              <tr key={row.subject.id}>
                <td className="sb">{row.subject.name}</td>

                {/* Half Yearly columns */}
                <td className="mm">{row.hasHy ? row.subject.hy : ""}</td>
                <td className="n">{row.hasHy ? hyI : ""}</td>
                {hasPractical && <td className="n">{row.hasHy ? hyII : ""}</td>}
                <td className="n">{row.hasHy ? formatNumber(row.hyTotal) : ""}</td>

                {/* Annual columns (empty in Stage 1) */}
                <td className="mm">{isStage2 && row.hasAnnual ? row.subject.an : ""}</td>
                <td className="n">{isStage2 && row.hasAnnual ? anI : ""}</td>
                {hasPractical && <td className="n">{isStage2 && row.hasAnnual ? anII : ""}</td>}
                <td className="n">{isStage2 && row.hasAnnual ? formatNumber(row.annualTotal) : ""}</td>

                {/* G. Total columns (empty in Stage 1) */}
                <td className="mm">{isStage2 && row.used ? formatNumber(row.grandMM) : ""}</td>
                <td className="n">{isStage2 && row.used ? formatNumber(row.grandMO) : ""}</td>

                {remarkCell(i)}
              </tr>
            );
          })}
          <tr className="tot">
            <td className="sb">Total</td>

            {/* Half Yearly Totals */}
            <td className="mm">{r.any ? formatNumber(r.totals.hyMM) : ""}</td>
            <td className="n">{r.any ? formatNumber(r.totals.hyI) : ""}</td>
            {hasPractical && <td className="n">{r.any ? formatNumber(r.totals.hyII) : ""}</td>}
            <td className="n">{r.any ? formatNumber(r.totals.hyTotal) : ""}</td>

            {/* Annual Totals (empty in Stage 1) */}
            <td className="mm">{isStage2 && r.any ? formatNumber(r.totals.annualMM) : ""}</td>
            <td className="n">{isStage2 && r.any ? formatNumber(r.totals.annualI) : ""}</td>
            {hasPractical && <td className="n">{isStage2 && r.any ? formatNumber(r.totals.annualII) : ""}</td>}
            <td className="n">{isStage2 && r.any ? formatNumber(r.totals.annualTotal) : ""}</td>

            {/* G. Total Totals (empty in Stage 1) */}
            <td className="mm">{isStage2 && r.any ? formatNumber(r.totals.grandMM) : ""}</td>
            <td className="n">{isStage2 && r.any ? formatNumber(r.totals.grandMO) : ""}</td>

            {remarkCell(n)}
          </tr>

          {/* Graded Subjects (Below Total — e.g. Arabic/Deeniyat, Computer) */}
          {r.gradedRows && r.gradedRows.length > 0 &&
            r.gradedRows.map((grow, idx) => {
              const showAnnual = isStage2 && grow.hasAnnual;
              const showGrand = isStage2 && (grow.hasHy || grow.hasAnnual);
              return (
                <tr key={grow.subject.id} className="grd">
                  <td className="sb">{grow.subject.name}</td>

                  {/* Half Yearly: M.M. is A.B.C., Obtained is Grade */}
                  <td className="mm">{grow.hasHy ? "A.B.C." : ""}</td>
                  <td className="n" colSpan={hasPractical ? 3 : 2}>
                    {grow.hasHy ? grow.hyGrade.toUpperCase() : ""}
                  </td>

                  {/* Annual: M.M. is A.B.C., Obtained is Grade (empty in Stage 1) */}
                  <td className="mm">{showAnnual ? "A.B.C." : ""}</td>
                  <td className="n" colSpan={hasPractical ? 3 : 2}>
                    {showAnnual ? grow.annualGrade.toUpperCase() : ""}
                  </td>

                  {/* Grand Total */}
                  <td className="mm">{showGrand ? "A.B.C." : ""}</td>
                  <td className="n">{showGrand ? grow.grandGrade.toUpperCase() : ""}</td>

                  {/* Remarks cell: empty border cell matching the rest of the table */}
                  {idx === 0 && (
                    <td
                      className="rm"
                      rowSpan={r.gradedRows.length}
                      style={{ background: "#fff" }}
                    />
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>

      <div className="gap" />
      <div className="sign">
        <span>Signature Guardian</span>
        <span>Signature Class Teacher</span>
        <span>Signature Principal</span>
      </div>
      <div className="strip thin bottom" />
      <div className="strip" />
    </div>
  );
}
