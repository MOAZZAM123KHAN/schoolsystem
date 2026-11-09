import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { readImage } from "../lib/images";

const schema = z.object({
  name: z.string().trim().min(1, "Student name is required."),
  father: z.string().trim(),
  mother: z.string().trim(),
  cls: z.string().trim().min(1, "Class is required (for example 9TH)."),
  roll: z.string().trim(),
  dob: z
    .string()
    .refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Enter a valid date.")
    .refine((v) => v === "" || new Date(v) <= new Date(), "Date of birth cannot be in the future."),
  sr: z.string().trim(),
  village: z.string().trim(),
  post: z.string().trim(),
  district: z.string().trim(),
  state: z.string().trim(),
});

// [field name, English label, Hindi label, input type]
const FIELDS = [
  ["name", "Scholar's name", "छात्र का नाम"],
  ["father", "Father's name", "पिता का नाम"],
  ["mother", "Mother's name", "माता का नाम"],
  ["cls", "Class (e.g. 9TH)", "कक्षा"],
  ["roll", "Roll No.", "अनुक्रमांक"],
  ["dob", "Date of birth", "जन्म तिथि", "date"],
  ["sr", "S.R. No.", "एस.आर. नं."],
  ["village", "Address village", "गाँव"],
  ["post", "Post", "डाकघर"],
  ["district", "District", "जनपद"],
  ["state", "State", "राज्य"],
];

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20";

/**
 * Personal details + photo for one student.
 * Props:
 *   student  — current values (use key={student.id} so it resets per student)
 *   isNew    — true when adding a new student
 *   onSave({ ...details, photo }) -> Promise
 *   onDelete() -> Promise   (not shown for a new student)
 */
export default function StudentForm({ student, isNew, onSave, onDelete }) {
  const [photo, setPhoto] = useState(student.photo || "");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [armed, setArmed] = useState(false);
  const fileRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(FIELDS.map(([k]) => [k, student[k] || ""])),
  });

  const onPhotoFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setPhoto(await readImage(file, { width: 264, height: 320, type: "image/jpeg" }));
      setMessage({ type: "", text: "Photo chosen. Click Save to keep it." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const submit = async (values) => {
    setMessage({ type: "", text: "" });
    try {
      await onSave({ ...values, photo });
      setMessage({ type: "ok", text: "Saved. / सहेजा गया।" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  // Two-step delete: first click asks "Sure?", second click deletes
  const askDelete = async () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 3500);
      return;
    }
    try {
      await onDelete();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--color-ink)]">
        {isNew ? "New student / नया छात्र" : "Personal details / व्यक्तिगत विवरण"}
        {student.isSample && (
          <span className="ml-2 rounded bg-[var(--color-saffron)] px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase text-[var(--color-ink)]">
            Sample
          </span>
        )}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map(([name, en, hi, type]) => (
          <div key={name}>
            <label htmlFor={`st-${name}`} className="mb-1 block text-sm font-semibold text-slate-700">
              {en} / {hi}
            </label>
            <input id={`st-${name}`} type={type || "text"} {...register(name)} className={inputCls} />
            {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-20 w-[66px] items-center justify-center overflow-hidden border border-slate-300 bg-slate-100">
          {photo ? (
            <img src={photo} alt="Student photo" className="h-full w-full object-cover" />
          ) : (
            <span className="text-center text-[10px] text-slate-400">No photo</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-[var(--color-ink)] px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          {photo ? "Change photo / फोटो बदलें" : "Add photo / फोटो जोड़ें"}
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => setPhoto("")}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600"
          >
            Remove photo
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhotoFile} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-ink)] px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {isNew ? "Add student" : "Save details"}
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={askDelete}
            className="rounded-lg border border-red-400 px-4 py-2 font-semibold text-red-600"
          >
            {armed ? "Sure? Click again to delete" : "Delete student"}
          </button>
        )}
        {message.text && (
          <span
            role="status"
            className={`text-sm font-semibold ${
              message.type === "ok" ? "text-green-700" : message.type === "error" ? "text-red-600" : "text-slate-600"
            }`}
          >
            {message.text}
          </span>
        )}
        {isDirty && !message.text && <span className="text-sm text-slate-500">Unsaved changes</span>}
      </div>
    </form>
  );
}

