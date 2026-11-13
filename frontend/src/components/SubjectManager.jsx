import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const MIN_SUBJECTS = 3;

const maxMarks = z.coerce
  .number({ error: "Number needed." })
  .min(0, "0 or more.");

const schema = z.object({
  subjects: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().trim().min(1, "Name needed."),
        hy: maxMarks,
        an: maxMarks,
        isGraded: z.boolean().optional(),
      })
    )
    .min(MIN_SUBJECTS, `Keep at least ${MIN_SUBJECTS} subjects.`),
});

const cell =
  "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20";

function newId() {
  return `x${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Add, rename, reorder and delete subjects, and set maximum marks (M.M.).
 * Half-yearly M.M. is only shown on the card; annual M.M. is used for results.
 * Props: subjects (current list), onSave(subjects) -> Promise
 */
export default function SubjectManager({ subjects, onSave }) {
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { subjects },
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: "subjects" });
  const currentValues = watch("subjects") || [];

  const submit = async (values) => {
    setMessage({ type: "", text: "" });
    try {
      await onSave(
        values.subjects.map((s) => ({
          ...s,
          hy: s.isGraded ? 0 : Number(s.hy || 0),
          an: s.isGraded ? 0 : Number(s.an || 0),
          isGraded: Boolean(s.isGraded),
        }))
      );
      setMessage({ type: "ok", text: "Saved. / सहेजा गया।" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const onDelete = (i) => {
    if (fields.length <= MIN_SUBJECTS) {
      setMessage({ type: "error", text: `Keep at least ${MIN_SUBJECTS} subjects.` });
      return;
    }
    remove(i);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3">
      <h2 className="text-lg font-bold text-[var(--color-ink)]">
        Subjects and maximum marks / विषय और पूर्णांक (M.M.)
      </h2>

      <div className="hidden grid-cols-[1fr_5.5rem_5.5rem_8.5rem_auto] gap-2 text-xs font-semibold text-slate-500 sm:grid">
        <span>Subject / विषय</span>
        <span>Half Yearly M.M.</span>
        <span>Annual M.M.</span>
        <span>Grading Type</span>
        <span className="w-[8.5rem]" />
      </div>

      <div className="space-y-2">
        {fields.map((f, i) => {
          const isGraded = Boolean(currentValues[i]?.isGraded);
          return (
            <div
              key={f.id}
              className={`grid grid-cols-2 gap-2 rounded-lg border p-2 sm:grid-cols-[1fr_5.5rem_5.5rem_8.5rem_auto] sm:border-0 sm:p-0 ${
                isGraded ? "bg-amber-50/50 sm:bg-transparent" : ""
              }`}
            >
              <div className="col-span-2 sm:col-span-1">
                <input aria-label="Subject name" {...register(`subjects.${i}.name`)} className={cell} />
                {errors.subjects?.[i]?.name && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.subjects[i].name.message}</p>
                )}
              </div>
              <div>
                {isGraded ? (
                  <div className="flex h-[38px] items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50 text-xs font-bold text-amber-800">
                    A.B.C.
                  </div>
                ) : (
                  <input
                    aria-label="Half yearly maximum marks"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    {...register(`subjects.${i}.hy`)}
                    className={cell}
                  />
                )}
                {errors.subjects?.[i]?.hy && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.subjects[i].hy.message}</p>
                )}
              </div>
              <div>
                {isGraded ? (
                  <div className="flex h-[38px] items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50 text-xs font-bold text-amber-800">
                    A.B.C.
                  </div>
                ) : (
                  <input
                    aria-label="Annual maximum marks"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    {...register(`subjects.${i}.an`)}
                    className={cell}
                  />
                )}
                {errors.subjects?.[i]?.an && (
                  <p className="mt-0.5 text-xs text-red-600">{errors.subjects[i].an.message}</p>
                )}
              </div>
              <div className="flex items-center">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    {...register(`subjects.${i}.isGraded`)}
                    className="h-4 w-4 rounded border-slate-300 text-[var(--color-ink)] focus:ring-[var(--color-ink)]"
                  />
                  <span>Below Total (Grade)</span>
                </label>
              </div>
              <div className="col-span-2 flex gap-1 sm:col-span-1">
                <button
                  type="button"
                  title="Move up"
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                  className="rounded-lg border border-slate-300 px-2.5 py-1 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  title="Move down"
                  disabled={i === fields.length - 1}
                  onClick={() => move(i, i + 1)}
                  className="rounded-lg border border-slate-300 px-2.5 py-1 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(i)}
                  className="rounded-lg border border-red-300 px-2.5 py-1 text-sm font-semibold text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {errors.subjects?.message && <p className="text-sm text-red-600">{errors.subjects.message}</p>}

      <p className="text-sm text-slate-500">
        Subjects marked as <b>Below Total (Grade)</b> (such as Arabic/Deeniyat, Computer) show in <b>Grade (A, B, C)</b> with M.M. <b>A.B.C.</b> below the Total row, and are not counted into percentage or pass/fail division.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => append({ id: newId(), name: "New subject", hy: 100, an: 100, isGraded: false })}
          className="rounded-lg border border-[var(--color-ink)] px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          + Add subject / विषय जोड़ें
        </button>
        <button
          type="button"
          onClick={() => append({ id: newId(), name: "Arabic/Deeniyat", hy: 0, an: 0, isGraded: true })}
          className="rounded-lg border border-amber-600 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900 hover:bg-amber-100"
        >
          + Add Graded subject (Below Total)
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-ink)] px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          Save subjects
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
