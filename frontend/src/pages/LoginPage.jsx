import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("This does not look like an email address."),
  password: z.string().min(1, "Please enter your password."),
});

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  if (!loading && user) return <Navigate to="/school" replace />;

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    try {
      await login(email, password);
      navigate(location.state?.from || "/school", { replace: true });
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)] px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        {/* pencil strip, same colours as the report card */}
        <div className="pencil-strip h-3" />
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 p-7">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-ink)]">Report Card Maker</h1>
            <p className="text-sm text-slate-500">प्रगति रिपोर्ट कार्ड · Please log in / लॉगिन करें</p>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
              Email / ईमेल
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              {...register("email")}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-700">
              Password / पासवर्ड
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-16 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 px-3 text-sm font-semibold text-[var(--color-ink)]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {serverError && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--color-ink)] py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in…" : "Log in / लॉगिन"}
          </button>
        </form>
      </div>
    </div>
  );
}

