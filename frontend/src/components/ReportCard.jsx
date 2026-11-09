import { useLayoutEffect, useRef } from "react";
import "./reportCard.css";
import { formatNumber, fullResult, isFilled } from "../lib/calculations";

// Column widths copied from the original card (mm)
const COLS = [33, 12, 15, 15, 15, 12, 15, 15, 15, 13, 15, 23];

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
 * The printed Progress Report Card (one A4 page).
 *
 * Half Yearly columns show the stored marks exactly as entered and their
 * "Total" cell is always empty — nothing is calculated from them.
 * Annual columns, G. Total and the Remarks (% age, Div., Position, Result)
 * come from lib/calculations.js, which uses annual marks only.
 *
 * Props:
 *   student      the student to print
 *   subjects     subject list from settings
 *   school       { name, addr, title, session, pass, logo }
 *   allStudents  everyone (needed for Position in Class)
 */
export default function ReportCard({ student, subjects, school, allStudents }) {
  const nameRef = useRef(null);

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

  const r = fullResult(student, allStudents, subjects, Number(school.pass));
  const n = r.rows.length;
  const rowCount = n + 1; // subject rows + Total row

  // Remarks column: four boxes (% age, Div., Position, Result) stacked down the
  // table, each taking an equal share of the rows.
  const groups = [
    ["% age", r.any ? `${formatNumber(r.percentage)}%` : ""],
    ["Div.", r.division],
    ["Position in Class", r.position],
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

  const num = (show, value) => <td className="n">{show ? formatNumber(value) : ""}</td>;
  const total = (value) => <td className="n">{r.any ? formatNumber(value) : ""}</td>;

  return (
    <div className="rc">
      <div className="strip" />
      <div className="strip thin" />

      <div className="hd">
        {school.logo ? <img src={school.logo} alt="" /> : null}
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

      <div className="banner">Mark Sheet- {school.session}</div>

      <table>
        <colgroup>
          {COLS.map((w, i) => (
            <col key={i} style={{ width: `${w}mm` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="hr" rowSpan={2}>
              Subject
            </th>
            <th className="hb" colSpan={4}>
              Half Yearly Exam.
            </th>
            <th className="hb" colSpan={4}>
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
            <th className="hs">
              II
              <br />
              Pract.
            </th>
            <th className="hs">Total</th>
            <th className="hs">M.M.</th>
            <th className="hs">I</th>
            <th className="hs">
              II
              <br />
              Pract.
            </th>
            <th className="hs">Total</th>
            <th className="hs">M.M.</th>
            <th className="hs">M.O.</th>
          </tr>
        </thead>
        <tbody>
          {r.rows.map((row, i) => {
            const m = (student.marks && student.marks[row.subject.id]) || [];
            const hy1 = isFilled(m[0]) ? String(m[0]).trim() : "";
            const hy2 = isFilled(m[1]) ? String(m[1]).trim() : "";
            const hyStored = isFilled(m[0]) || isFilled(m[1]);
            return (
              <tr key={row.subject.id}>
                <td className="sb">{row.subject.name}</td>
                {/* Half Yearly: stored marks exactly as entered; Total left empty */}
                <td className="n">{hyStored ? row.subject.hy : ""}</td>
                <td className="n">{hy1}</td>
                <td className="n">{hy2}</td>
                <td className="n" />
                {/* Annual: calculated */}
                {num(row.used, row.annualMM)}
                {num(isFilled(m[2]), row.annualI)}
                {num(isFilled(m[3]), row.annualII)}
                {num(row.used, row.annualTotal)}
                {/* G. Total: annual only */}
                {num(row.used, row.grandMM)}
                {num(row.used, row.grandMO)}
                {remarkCell(i)}
              </tr>
            );
          })}
          <tr className="tot">
            <td className="sb">Total</td>
            {/* Nothing is calculated for the Half Yearly columns */}
            <td className="n" />
            <td className="n" />
            <td className="n" />
            <td className="n" />
            {total(r.totals.annualMM)}
            {total(r.totals.annualI)}
            {total(r.totals.annualII)}
            {total(r.totals.annualTotal)}
            {total(r.totals.grandMM)}
            {total(r.totals.grandMO)}
            {remarkCell(n)}
          </tr>
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

