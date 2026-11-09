import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

const schema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(6, "New password must be at least 6 characters."),
    confirm: z.string().min(1, "Type the new password again."),
  })
  .refine((v) => v.next === v.confirm, {
    path: ["confirm"],
    message: "The two new passwords do not match.",
  })
  .refine((v) => v.next !== v.current, {
    path: ["next"],
    message: "New password must be different from the current one.",
  });

export default function ChangePasswordDialog({ onClose }) {
  const { changePassword } = useAuth();
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ current, next }) => {
    setServerError("");
    try {
      await changePassword(current, next);
      setDone(true);
    } catch (err) {
      setServerError(err.message);
    }
  };

  const field = (name, label, autoComplete) => (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        type="password"
        autoComplete={autoComplete}
        {...register(name)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20"
      />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Change password"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-ink)]">
          Change password / पासवर्ड बदलें
        </h2>

        {done ? (
          <div className="space-y-4">
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
              Password changed. Use the new password next time you log in.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-[var(--color-ink)] py-2 font-semibold text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {field("current", "Current password / वर्तमान पासवर्ड", "current-password")}
            {field("next", "New password / नया पासवर्ड", "new-password")}
            {field("confirm", "Repeat new password / दोबारा लिखें", "new-password")}
            {serverError && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {serverError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-300 py-2 font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-[var(--color-ink)] py-2 font-semibold text-white disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

