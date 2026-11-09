import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChangePasswordDialog from "./ChangePasswordDialog";

const links = [
  { to: "/school", en: "1. School & Subjects", hi: "विद्यालय" },
  { to: "/students", en: "2. Students & Marks", hi: "छात्र" },
  { to: "/cards", en: "3. Report Cards", hi: "रिपोर्ट कार्ड" },
];

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const onLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-[var(--color-ink)] text-white shadow">
      <div className="pencil-strip h-1.5" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
        <span className="text-base font-bold">Report Card Maker</span>

        <nav className="flex flex-wrap gap-1" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-semibold ${
                  isActive ? "bg-white text-[var(--color-ink)]" : "text-white/90 hover:bg-white/15"
                }`
              }
            >
              {l.en} <span className="font-normal opacity-70">· {l.hi}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="hidden text-white/70 sm:inline">{user?.email}</span>
          <button
            onClick={() => setShowPw(true)}
            className="rounded-md border border-white/40 px-2.5 py-1 font-semibold hover:bg-white/15"
          >
            Change password
          </button>
          <button
            onClick={onLogout}
            className="rounded-md bg-[var(--color-saffron)] px-2.5 py-1 font-semibold text-[var(--color-ink)] hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
      {showPw && <ChangePasswordDialog onClose={() => setShowPw(false)} />}
    </header>
  );
}

