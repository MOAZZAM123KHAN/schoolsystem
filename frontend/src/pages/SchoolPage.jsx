import { useEffect, useState } from "react";
import SchoolSettings from "../components/SchoolSettings";
import SubjectManager from "../components/SubjectManager";
import { getSettings, saveSchool, saveSubjects } from "../services/settingsService";

export default function SchoolPage() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!settings) return <p className="text-slate-500">Loading…</p>;

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SchoolSettings school={settings.school} onSave={saveSchool} />
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <SubjectManager subjects={settings.subjects} onSave={saveSubjects} />
      </section>
    </div>
  );
}
