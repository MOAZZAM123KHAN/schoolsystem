/**
 * studentService — connected to the Express + MongoDB backend.
 *
 * Communicates with /api/students endpoints.
 */
import { apiRequest } from "./apiClient";

/** @returns {Promise<object[]>} all students */
export async function listStudents() {
  return apiRequest("/api/students");
}

/** @returns {Promise<object|null>} one student, or null if not found */
export async function getStudent(id) {
  try {
    return await apiRequest(`/api/students/${id}`);
  } catch {
    return null;
  }
}

/** Create a student. @returns {Promise<object>} the saved student */
export async function createStudent(data) {
  return apiRequest("/api/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update a student.
 * @returns {Promise<object>} the updated student
 */
export async function updateStudent(id, changes) {
  return apiRequest(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}

/** Delete a student. */
export async function deleteStudent(id) {
  await apiRequest(`/api/students/${id}`, {
    method: "DELETE",
  });
}
