import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentList from "../components/StudentList";
import StudentForm from "../components/StudentForm";
import MarksEntry from "../components/MarksEntry";
import {
  createStudent,
  deleteStudent,
  listStudents,
  updateStudent,
} from "../services/studentService";
import { getSettings } from "../services/settingsService";

// What a brand-new student starts with (district and state are usually the same)
const BLANK = {
  name: "",
  father: "",
  mother: "",
  cls: "",
  roll: "",
  dob: "",
  sr: "",
  village: "",
  post: "",
  district: "JAUNPUR",
  state: "UTTAR PRADESH",
  photo: "",
  marks: {},
};

export default function StudentsPage() {
  const { id } = useParams(); // undefined, "new", or a student id
  const navigate = useNavigate();
  const [students, setStudents] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setStudents(await listStudents());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    reload();
    getSettings()
      .then(setSettings)
      .catch((e) => setError(e.message));
  }, [reload]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!students || !settings) return <p className="text-slate-500">Loading…</p>;

  const isNew = id === "new";
  const selected = isNew ? BLANK : students.find((s) => s.id === id);

  const onSave = async (values) => {
    if (isNew) {
      const created = await createStudent({ ...BLANK, ...values });
      await reload();
      navigate(`/students/${created.id}`);
    } else {
      await updateStudent(selected.id, values);
      await reload();
    }
  };

  const onSaveMarks = async (marks) => {
    await updateStudent(selected.id, { marks });
    await reload();
  };

  const onDelete = async () => {
    await deleteStudent(selected.id);
    await reload();
    navigate("/students");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <StudentList students={students} selectedId={isNew ? null : id} />

      <div className="space-y-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {selected ? (
            <StudentForm
              key={isNew ? "new" : selected.id}
              student={selected}
              isNew={isNew}
              onSave={onSave}
              onDelete={onDelete}
            />
          ) : (
            <p className="text-slate-500">
              {id
                ? "That student was not found. Pick one from the list."
                : "Pick a student from the list, or click “New student”."}
            </p>
          )}
        </section>

        {selected && !isNew && (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <MarksEntry
              key={selected.id}
              student={selected}
              subjects={settings.subjects}
              passPercent={Number(settings.school.pass)}
              allStudents={students}
              onSave={onSaveMarks}
            />
          </section>
        )}
        {isNew && (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
            Add the student first, then the marks table appears here.
          </p>
        )}
      </div>
    </div>
  );
}
