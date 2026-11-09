/**
 * studentService — all student records, including their marks.
 *
 * Stored in localStorage for now. Every function is async so the backend can
 * replace this file (GET/POST/PUT/DELETE /api/students) without changing any
 * component. Keep the same function names and return shapes.
 *
 * Student shape:
 * {
 *   id, name, father, mother, cls, roll, dob ("YYYY-MM-DD"), sr,
 *   village, post, district, state,
 *   photo,            // small image as text (data URL), or ""
 *   marks,            // { [subjectId]: [halfI, halfII, annualI, annualII] } as strings
 *   isSample?         // true only for the built-in sample students
 * }
 */
import { sampleStudents } from "../data/sampleData";

const KEY = "rc_students_v1";

function newId() {
  return `st${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function readAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to the sample students */
  }
  // First run: start with the 3 sample students
  const seeded = structuredClone(sampleStudents);
  localStorage.setItem(KEY, JSON.stringify(seeded));
  return seeded;
}

function writeAll(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    throw new Error("Could not save: browser storage is full. Use smaller photos or delete old students.");
  }
}

/** @returns {Promise<object[]>} all students */
export async function listStudents() {
  return readAll();
}

/** @returns {Promise<object|null>} one student, or null if not found */
export async function getStudent(id) {
  return readAll().find((s) => s.id === id) || null;
}

/** Create a student. @returns {Promise<object>} the saved student (with its new id) */
export async function createStudent(data) {
  const list = readAll();
  const student = { marks: {}, photo: "", ...data, id: newId() };
  delete student.isSample;
  writeAll([...list, student]);
  return student;
}

/**
 * Update a student. Only the fields you pass are changed; everything else
 * (for example the marks) stays as it was.
 * @returns {Promise<object>} the saved student
 */
export async function updateStudent(id, changes) {
  const list = readAll();
  const i = list.findIndex((s) => s.id === id);
  if (i < 0) throw new Error("Student not found.");
  const updated = { ...list[i], ...changes, id };
  list[i] = updated;
  writeAll(list);
  return updated;
}

/** Delete a student. */
export async function deleteStudent(id) {
  writeAll(readAll().filter((s) => s.id !== id));
}

