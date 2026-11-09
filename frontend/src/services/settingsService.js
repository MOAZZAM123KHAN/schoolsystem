/**
 * settingsService — connected to the Express + MongoDB backend.
 *
 * Communicates with /api/settings endpoints.
 */
import { apiRequest } from "./apiClient";

/** @returns {Promise<{school: object, subjects: object[]}>} */
export async function getSettings() {
  return apiRequest("/api/settings");
}

/**
 * Save the whole settings object.
 */
export async function saveSettings(settings) {
  return apiRequest("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

/** Save only the school block. */
export async function saveSchool(school) {
  return apiRequest("/api/settings/school", {
    method: "PUT",
    body: JSON.stringify(school),
  });
}

/** Save only the subject list. */
export async function saveSubjects(subjects) {
  return apiRequest("/api/settings/subjects", {
    method: "PUT",
    body: JSON.stringify(subjects),
  });
}
