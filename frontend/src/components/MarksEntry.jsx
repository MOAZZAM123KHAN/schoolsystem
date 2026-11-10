import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  calculateStudent,
  exceedsMax,
  formatNumber,
} from "../lib/calculations";

const EMPTY = ["", "", "", ""];

const markText = z
  .string()
  .refine(
    (v) => v.trim() === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0),
    "Marks must be a positive number or empty."
  );

function buildSchema(subjects) {
  const shape = {};
  subjects.forEach((s) => {
    shape[s.id] = z.tuple([markText, markText, markText, markText]);
  });
  return z
    .object({ marks: z.object(shape) })
    .superRefine((val, ctx) => {
      subjects.forEach((s) => {
        const m = val.marks[s.id] || EMPTY;
        if (exceedsMax([m[0], m[1]], s.hy)) {
          ctx.addIssue({
            code: "custom",
            path: ["marks", s.id, 0],
            message: `${s.name}: Half Yearly marks exceed M.M. (${s.hy}).`,
          });
        }
        if (exceedsMax([m[2], m[3]], s.an)) {
          ctx.addIssue({
            code: "custom",
            path: ["marks", s.id, 2],
            message: `${s.name}: Annual marks exceed M.M. (${s.an}).`,
          });
        }
      });
    });
}

const cellCls =
  "w-full min-w-[3.25rem] rounded-md border px-1 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/25 text-slate-900 bg-white";

/**
 * Two-stage marks entry screen:
 * - Half Yearly (I, II Pract.)
 * - Annual (I, II Pract.)
 *
 * Stage 1 (Half Yearly): When no annual marks are entered.
 * Stage 2 (Annual): When annual marks are entered, combined G. Total is calculated.
 */
export default function MarksEntry({ student, subjects, passPercent, onSave }) {
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

  // Live recalculation on every keystroke
  const live = watch("marks") || defaultMarks;
  const liveStudent = { ...student, marks: live };
  const result = calculateStudent(liveStudent, subjects, passPercent);
  const isStage2 = result.stage === 2;

  // Collect error messages
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
      setMessage({ type: "ok", text: "Marks saved successfully. / अंक सहेजे गए।" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const resultClass = result.passed ? "text-green-700" : "text-red-600";

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Marks Entry / अंक प्रविष्टि</h2>
          <p className="text-xs text-slate-500">
            {isStage2
              ? "⚡ Stage 2 Active: Annual marks entered — combined G. Total & result calculated."
              : "🌱 Stage 1 Active: Half Yearly only (Annual marks can be entered later)."}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isStage2
              ? "bg-purple-100 text-purple-800 border border-purple-300"
              : "bg-blue-100 text-blue-800 border border-blue-300"
          }`}
        >
          {isStage2 ? "Stage 2: Annual & G. Total" : "Stage 1: Half Yearly"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--color-ink)]/10 text-slate-800">
              <th rowSpan={2} className="border border-slate-300 px-2 py-1 text-left">
                Subject / विषय
              </th>
              <th colSpan={2} className="border border-slate-300 px-2 py-1">
                Half Yearly <span className="block text-[10px] font-normal text-slate-500">Stage 1</span>
              </th>
              <th colSpan={2} className="border border-slate-300 px-2 py-1">
                Annual <span className="block text-[10px] font-normal text-slate-500">Stage 2</span>
              </th>
              <th rowSpan={2} className="border border-slate-300 px-2 py-1">
                {isStage2 ? "G. Total" : "HY Total"}
                <span className="block text-[10px] font-normal text-slate-500">
                  {isStage2 ? "M.O. / M.M." : "M.O. / M.M."}
                </span>
              </th>
            </tr>
            <tr className="bg-[var(--color-ink)]/10 text-xs text-slate-700">
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
                <tr key={s.id} className="hover:bg-slate-50/50">
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
                          aria-label={`${s.name} ${k < 2 ? "half yearly" : "annual"} ${
                            k % 2 ? "II Pract." : "I"
                          } marks`}
                          {...register(`marks.${s.id}.${k}`)}
                          className={`${cellCls} ${
                            over || bad ? "border-red-500 bg-red-50 text-red-900" : "border-slate-300"
                          }`}
                        />
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap border border-slate-300 px-2 py-1 text-center font-semibold">
                    {row?.used ? (
                      <>
                        {isStage2 ? (
                          <>
                            {formatNumber(row.grandMO)} / {formatNumber(row.grandMM)}
                          </>
                        ) : (
                          <>
                            {formatNumber(row.hyTotal)} / {formatNumber(row.hyMM)}
                          </>
                        )}
                        {!row.ok && <span className="font-bold text-red-600"> ✕</span>}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Live Preview Summary Bar */}
      <div className="rounded-lg bg-[var(--color-ink)]/10 p-3 font-semibold text-slate-800" aria-live="polite">
        {result.any ? (
          <div>
            <span className="text-xs uppercase tracking-wide text-slate-500 block mb-1">
              Live Preview ({isStage2 ? "Stage 2: Combined G. Total" : "Stage 1: Half Yearly"}):
            </span>
            {isStage2 ? (
              <>
                Total: {formatNumber(result.totals.grandMO)} / {formatNumber(result.totals.grandMM)} ·{" "}
                {formatNumber(result.percentage)}% · Division: {result.division} · Result:{" "}
                <span className={resultClass}>{result.result}</span>
              </>
            ) : (
              <>
                Total: {formatNumber(result.totals.hyTotal)} / {formatNumber(result.totals.hyMM)} ·{" "}
                {formatNumber(result.percentage)}% · Division: {result.division} · Result:{" "}
                <span className={resultClass}>{result.result}</span>
              </>
            )}
          </div>
        ) : (
          <span className="text-slate-500 font-normal text-sm">
            Enter marks above to preview totals, percentage, division, and result.
          </span>
        )}
      </div>

      {errorList.length > 0 && (
        <ul role="alert" className="list-disc rounded-lg bg-red-50 py-2 pl-7 pr-3 text-sm text-red-700">
          {errorList.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-500">
        • Column II is practical mark (can remain empty).
        <br />
        • Red box indicates entered marks exceed subject M.M.
        <br />
        • Position in Class is filled manually on the printed report card.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-ink)] px-5 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save marks / अंक सहेजें"}
        </button>
        {message.text && (
          <span
            role="status"
            className={`text-sm font-semibold ${
              message.type === "ok" ? "text-green-700" : "text-red-600"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </form>
  );
}
