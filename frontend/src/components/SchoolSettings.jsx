import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { readImage } from "../lib/images";

const schema = z.object({
  name: z.string().trim().min(1, "School name is required."),
  addr: z.string().trim().min(1, "Address is required."),
  title: z.string().trim().min(1, "Card title is required."),
  session: z.string().trim().min(1, "Session is required."),
  pass: z.coerce
    .number({ error: "Enter a number." })
    .min(0, "Must be 0 or more.")
    .max(100, "Must be 100 or less."),
});

const inputCls =
  "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20";

/**
 * School name, address, card title, session, pass %, and logo.
 * Props: school (current values), onSave(school) -> Promise
 */
export default function SchoolSettings({ school, onSave }) {
  const [logo, setLogo] = useState(school.logo || "");
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: school.name,
      addr: school.addr,
      title: school.title,
      session: school.session,
      pass: school.pass,
    },
  });

  const onLogoFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setLogo(await readImage(file, { width: 240, type: "image/png" }));
      setMessage({ type: "", text: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const submit = async (values) => {
    setMessage({ type: "", text: "" });
    try {
      await onSave({ ...values, logo });
      setMessage({ type: "ok", text: "Saved. / सहेजा गया।" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const field = (name, label, props = {}) => (
    <div>
      <label htmlFor={`sc-${name}`} className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input id={`sc-${name}`} {...register(name)} {...props} className={inputCls} />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <h2 className="text-lg font-bold text-[var(--color-ink)]">
        School details / विद्यालय विवरण
      </h2>
      <p className="text-sm text-slate-500">These are printed on every report card.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "School / college name / विद्यालय का नाम")}
        {field("addr", "Address line / पता")}
        {field("title", "Card title / कार्ड का शीर्षक")}
        {field("session", 'Session / सत्र (printed as "Mark Sheet- …")')}
        {field("pass", "Minimum pass % in each subject / न्यूनतम उत्तीर्णांक %", {
          type: "number",
          inputMode: "decimal",
          step: "any",
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-white">
          {logo ? (
            <img src={logo} alt="School logo" className="h-full w-full object-contain" />
          ) : (
            <span className="text-xs text-slate-400">No logo</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-[var(--color-ink)] px-3 py-1.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          Change logo / लोगो बदलें
        </button>
        <button
          type="button"
          onClick={() => setLogo("")}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600"
        >
          Remove logo
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onLogoFile} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-ink)] px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          Save school details
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
