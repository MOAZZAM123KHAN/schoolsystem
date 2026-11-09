import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  exceedsMax,
  formatNumber,
  fullResult,
} from "../lib/calculations";

const EMPTY = ["", "", "", ""];

// One typed mark: empty, or a number that is 0 or more
const markText = z
  .string()
  .refine((v) => v.trim() === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0), "Marks must be a number, 0 or more.");

function buildSchema(subjects) {
  const shape = {};
  subjects.forEach((s) => {
    shape[s.id] = z.tuple([markText, markText, markText, markText]);
  });
  return z
    .object({ marks: z.object(shape) })
    .superRefine((val, ctx) => {
      // Typing-mistake check: one exam's I + II Pract. must not be more than its M.M.
      subjects.forEach((s) => {
        const m = val.marks[s.id];
        if (exceedsMax([m[0], m[1]], s.hy)) {
          ctx.addIssue({ code: "custom", path: ["marks", s.id, 0], message: `${s.name}: Half Yearly marks are more than M.M. (${s.hy}).` });
        }
        if (exceedsMax([m[2], m[3]], s.an)) {
          ctx.addIssue({ code: "custom", path: ["marks", s.id, 2], message: `${s.name}: Annual marks are more than M.M. (${s.an}).` });
        }
      });
    });
}

const cellCls =
  "w-full min-w-[3.25rem] rounded-md border px-1 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/25";

/**
 * Enter half-yearly and annual marks for one student.
 *
 * - Half Yearly columns are STORED ONLY. Nothing is calculated from them.
 * - The G. Total column and the summary line use ANNUAL marks only
 *   (see lib/calculations.js).
 *
 * Props:
 *   student      the student being edited (use key={student.id})
 *   subjects     subject list from settings
 *   passPercent  pass mark from settings
 *   allStudents  everyone (needed for Position in Class)
 *   onSave(marks) -> Promise
 */
export default function MarksEntry({ student, subjects, passPercent, allStudents, onSave }) {
  const [message, setMessage] = useState({ type: "", text: "" });
  const schema = useMemo(() => buildSchema(subjects), [subjects]);

  const defaultMarks = useMemo(() => {
    const out = {};
    subjects.forEach((s) => {
      const m = (student.marks && student.marks[s.id]) || EMPTY;
      out[s.id] = [m[0] ?? "", m[1] ?? "", m[2] ?? "", m[3] ?? ""];
    });
    return out;
  }, [student, subjects]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { marks: defaultMarks } });

  // Live values while typing, so the result updates immediately
  const live = watch("marks");
  const liveStudent = { ...student, marks: live };
  const everyone = allStudents.map((s) => (s.id === student.id ? liveStudent : s));
  const result = fullResult(liveStudent, everyone, subjects, passPercent);

  // Collect readable error messages for the summary under the table
  const errorList = [];
  subjects.forEach((s) => {
    const e = errors.marks?.[s.id];
    if (!e) return;
    [0, 1, 2, 3].forEach((k) => {
      const msg = e[k]?.message;
      if (msg && !errorList.includes(msg)) errorList.push(msg);
    });
  });

  const submit = async (values) => {
    setMessage({ type: "", text: "" });
    try {
      await onSave(values.marks);
      setMessage({ type: "ok", text: "Marks saved. / अंक सहेजे गए।" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const resultClass = result.passed ? "text-green-700" : "text-red-600";

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3">
      <h2 className="text-lg font-bold text-[var(--color-ink)]">Marks / अंक</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-ink)]/10">
              <th rowSpan={2} className="border border-slate-300 px-2 py-1 text-left">
                Subject / विषय
              </th>
              <th colSpan={2} className="border border-slate-300 px-2 py-1">
                Half Yearly <span className="block text-[10px] font-normal text-slate-500">saved only, not used in result</span>
              </th>
              <th colSpan={2} className="border border-slate-300 px-2 py-1">
                Annual <span className="block text-[10px] font-normal text-slate-500">used for the result</span>
              </th>
              <th rowSpan={2} className="border border-slate-300 px-2 py-1">
                G. Total
                <span className="block text-[10px] font-normal text-slate-500">annual M.O. / M.M.</span>
              </th>
            </tr>
            <tr className="bg-[var(--color-ink)]/10 text-xs">
              <th className="border border-slate-300 px-2 py-1">I</th>
              <th className="border border-slate-300 px-2 py-1">II Pract.</th>
              <th className="border border-slate-300 px-2 py-1">I</th>
              <th className="border border-slate-300 px-2 py-1">II Pract.</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, rowIndex) => {
              const row = result.rows[rowIndex];
              const m = live[s.id] || EMPTY;
              const hyOver = exceedsMax([m[0], m[1]], s.hy);
              const anOver = exceedsMax([m[2], m[3]], s.an);
              return (
                <tr key={s.id}>
                  <td className="whitespace-nowrap border border-slate-300 px-2 py-1 text-left">
                    {s.name}{" "}
                    <small className="text-slate-400">
                      ({s.hy}+{s.an})
                    </small>
                  </td>
                  {[0, 1, 2, 3].map((k) => {
                    const over = k < 2 ? hyOver : anOver;
                    const bad = errors.marks?.[s.id]?.[k];
                    return (
                      <td key={k} className="border border-slate-300 p-1">
                        <input
                          inputMode="decimal"
                          aria-label={`${s.name} ${k < 2 ? "half yearly" : "annual"} ${k % 2 ? "II Pract." : "I"} marks`}
                          {...register(`marks.${s.id}.${k}`)}
                          className={`${cellCls} ${
                            over || bad ? "border-red-500 bg-red-50" : "border-slate-300"
                          }`}
                        />
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap border border-slate-300 px-2 py-1 text-center">
                    {row?.used ? (
                      <>
                        {formatNumber(row.grandMO)} / {formatNumber(row.grandMM)}
                        {!row.ok && <span className="font-bold text-red-600"> ✕</span>}
                      </>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-[var(--color-ink)]/10 px-3 py-2 font-semibold" aria-live="polite">
        {result.any ? (
          <>
            Total {formatNumber(result.totals.grandMO)} / {formatNumber(result.totals.grandMM)} ·{" "}
            {formatNumber(result.percentage)}% · Division: {result.division} · Position:{" "}
            {result.position || "-"} · Result: <span className={resultClass}>{result.result}</span>
          </>
        ) : (
          "Enter annual marks to see the result."
        )}
      </div>

      {errorList.length > 0 && (
        <ul role="alert" className="list-disc rounded-lg bg-red-50 py-2 pl-7 pr-3 text-sm text-red-700">
          {errorList.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <p className="text-sm text-slate-500">
        Column II is the practical mark and can stay empty. A red box means the marks are more than
        M.M. The <b>result uses annual marks only</b>; half-yearly marks are just kept on record and
        printed on the card.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-ink)] px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          Save marks / अंक सहेजें
        </button>
        {message.text && (
          <span
            role="status"
            className={`text-sm font-semibold ${message.type === "ok" ? "text-green-700" : "text-red-600"}`}
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
