import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ClassFilter from "../components/ClassFilter";
import ReportCard from "../components/ReportCard";
import ReportCardPreview from "../components/ReportCardPreview";
import { classKey } from "../lib/calculations";
import { elementsToPdf, safeFileName, waitForRender } from "../lib/pdf";
import { listStudents } from "../services/studentService";
import { getSettings } from "../services/settingsService";

const btnPrimary =
  "rounded-lg bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50";
const btnGhost =
  "rounded-lg border border-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-50";

export default function ReportCardsPage() {
  const [students, setStudents] = useState(null);
  const [settings, setSettings] = useState(null);
  const [cls, setCls] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [showPractical, setShowPractical] = useState(true);
  const [job, setJob] = useState(null); // { type: "pdf" | "print", list, filename }
  const [error, setError] = useState("");
  const hostRef = useRef(null);

  useEffect(() => {
    Promise.all([listStudents(), getSettings()])
      .then(([st, se]) => {
        setStudents(st);
        setSettings(se);
        if (se.school?.showPractical !== undefined) {
          setShowPractical(se.school.showPractical);
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  // Distinct class names, in the order they first appear
  const classes = useMemo(() => {
    const seen = new Set();
    const out = [];
    (students || []).forEach((s) => {
      const k = String(s.cls || "").trim();
      if (k && !seen.has(k.toUpperCase())) {
        seen.add(k.toUpperCase());
        out.push(k);
      }
    });
    return out;
  }, [students]);

  const shown = useMemo(
    () => (students || []).filter((s) => !cls || classKey(s.cls) === classKey(cls)),
    [students, cls]
  );

  // Keep the chosen student valid when the class changes
  const selected = shown.find((s) => s.id === selectedId) || shown[0] || null;

  // Run the PDF / print job once its cards are on the page
  useEffect(() => {
    if (!job) return undefined;
    let alive = true;
    (async () => {
      try {
        await waitForRender();
        if (!alive) return;
        if (job.type === "pdf") {
          await elementsToPdf([...hostRef.current.querySelectorAll(".rc")], job.filename);
          if (alive) setJob(null);
        } else {
          window.print();
        }
      } catch (e) {
        setError(e.message || "Could not make the PDF. Use Print and choose “Save as PDF”.");
        setJob(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [job]);

  // After printing, remove the hidden print copies
  useEffect(() => {
    const done = () => setJob(null);
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, []);

  if (error && !students) return <p className="text-red-600">{error}</p>;
  if (!students || !settings) return <p className="text-slate-500">Loading…</p>;

  const busy = Boolean(job);
  const start = (type, list, filename) => {
    setError("");
    if (!list.length) {
      setError("There are no students to use.");
      return;
    }
    setJob({ type, list, filename });
  };

  const classLabel = cls ? `class ${cls}` : "all students";
  const classFile = safeFileName(cls || "all");

  return (
    <div className="space-y-4">
      <section className="no-print space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <ClassFilter
            classes={classes}
            value={cls}
            onChange={(v) => {
              setCls(v);
              setSelectedId("");
            }}
          />
          <div>
            <label htmlFor="student-pick" className="mb-1 block text-sm font-semibold text-slate-700">
              Student / छात्र
            </label>
            <select
              id="student-pick"
              value={selected?.id || ""}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]/20"
            >
              {shown.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.roll || "-"} · {s.name || "(no name)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={showPractical}
              onChange={(e) => setShowPractical(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[var(--color-ink)] focus:ring-[var(--color-ink)]"
            />
            <span>Include Practical Marks (II Pract.) on Report Card / रिपोर्ट कार्ड पर प्रैक्टिकल (II Pract.) दिखाएं</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy || !selected}
            onClick={() =>
              start("pdf", [selected], `report-card-${safeFileName(selected.name)}.pdf`)
            }
            className={btnPrimary}
          >
            {busy && job.type === "pdf" ? "Making PDF…" : "Download PDF (this student)"}
          </button>
          <button
            disabled={busy || shown.length === 0}
            onClick={() => start("pdf", shown, `report-cards-${classFile}.pdf`)}
            className={btnGhost}
          >
            Download PDF ({classLabel}, {shown.length})
          </button>
          <button
            disabled={busy || !selected}
            onClick={() => start("print", [selected])}
            className={btnGhost}
          >
            Print this
          </button>
          <button
            disabled={busy || shown.length === 0}
            onClick={() => start("print", shown)}
            className={btnGhost}
          >
            Print all shown
          </button>
        </div>

        <p className="text-sm text-slate-500">{shown.length} student(s) in this selection.</p>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </section>

      <div className="no-print">
        <ReportCardPreview
          student={selected}
          subjects={settings.subjects}
          school={settings.school}
          allStudents={students}
          showPractical={showPractical}
        />
      </div>

      {/* Hidden copies of the cards used for the PDF and for printing */}
      {job &&
        createPortal(
          <div ref={hostRef} className={`rc-host ${job.type === "pdf" ? "is-pdf" : "is-print"}`}>
            {job.list.map((s) => (
              <ReportCard
                key={s.id}
                student={s}
                subjects={settings.subjects}
                school={settings.school}
                allStudents={students}
                showPractical={showPractical}
              />
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
