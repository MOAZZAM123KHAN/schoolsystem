import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Left-hand list of students with a search box.
 * Props: students, selectedId
 */
export default function StudentList({ students, selectedId }) {
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.name} ${s.roll} ${s.cls}`.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <div className="space-y-2">
      <Link
        to="/students/new"
        className="block rounded-lg bg-[var(--color-ink)] px-4 py-2 text-center font-semibold text-white hover:opacity-90"
      >
        + New student / नया छात्र
      </Link>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name, roll or class / खोजें"
        aria-label="Search students"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20"
      />

      <div className="max-h-[28rem] overflow-auto rounded-lg border border-slate-200 bg-white lg:max-h-[40rem]">
        {shown.length === 0 ? (
          <p className="p-3 text-sm text-slate-500">
            {students.length === 0 ? "No students yet." : "No student matches your search."}
          </p>
        ) : (
          <ul>
            {shown.map((s) => (
              <li key={s.id} className="border-b border-slate-100 last:border-0">
                <Link
                  to={`/students/${s.id}`}
                  aria-current={s.id === selectedId ? "true" : undefined}
                  className={`block px-3 py-2 hover:bg-slate-50 ${
                    s.id === selectedId ? "bg-[var(--color-ink)]/10 font-bold" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {s.name || "(no name)"}
                    {s.isSample && (
                      <span className="rounded bg-[var(--color-saffron)] px-1.5 text-[10px] font-bold uppercase text-[var(--color-ink)]">
                        Sample
                      </span>
                    )}
                  </span>
                  <small className="font-normal text-slate-500">
                    Roll {s.roll || "-"} · Class {s.cls || "-"}
                  </small>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

