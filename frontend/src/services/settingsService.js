/**
 * settingsService — school details, logo and subject list.
 *
 * Stored in localStorage for now. Every function is async so the backend can
 * replace this file (for example GET/PUT /api/settings) without changing any
 * component. Keep the same function names and return shapes.
 *
 * Settings shape:
 * {
 *   school:   { name, addr, title, session, pass, logo },
 *   subjects: [{ id, name, hy, an }]   // hy / an = maximum marks (M.M.)
 * }
 */
import LOGO from "../assets/logo";

const KEY = "rc_settings_v1";

const SUBJECT_NAMES = [
  "Hindi",
  "English",
  "Urdu/Sanskrit",
  "Social Science",
  "Civics",
  "H. Science/Maths",
  "Sociology",
  "Economics",
  "History",
  "Education",
  "Drawing",
  "Science",
  "Theology",
];

/** The settings used the very first time the app opens. */
export function defaultSettings() {
  return {
    school: {
      name: "Dr. WAKEEL NAZEER INTER COLLEGE",
      addr: "MANI KALAN, JAUNPUR (U.P.)",
      title: "PROGRESS REPORT CARD",
      session: "2026-27",
      pass: 33,
      logo: LOGO,
    },
    subjects: SUBJECT_NAMES.map((name, i) => ({ id: `s${i + 1}`, name, hy: 100, an: 100 })),
  };
}

/** @returns {Promise<object>} the saved settings (or the defaults) */
export async function getSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const base = defaultSettings();
      return { school: { ...base.school, ...saved.school }, subjects: saved.subjects || base.subjects };
    }
  } catch {
    /* fall through to defaults */
  }
  return defaultSettings();
}

/**
 * Save the whole settings object.
 * @throws {Error} if the browser storage is full (for example a very large logo)
 */
export async function saveSettings(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    throw new Error("Could not save: browser storage is full. Try a smaller logo.");
  }
  return settings;
}

/** Save only the school block, keeping subjects as they are. */
export async function saveSchool(school) {
  const current = await getSettings();
  return saveSettings({ ...current, school });
}

/** Save only the subject list, keeping the school block as it is. */
export async function saveSubjects(subjects) {
  const current = await getSettings();
  return saveSettings({ ...current, subjects });
}

