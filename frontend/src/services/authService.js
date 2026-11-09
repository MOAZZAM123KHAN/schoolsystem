/**
 * authService — connected to the Express + MongoDB backend.
 *
 * Communicates with /api/auth/login, /api/auth/me, /api/auth/change-password,
 * and /api/auth/logout using JWT tokens.
 */
import { apiRequest, getToken, setToken } from "./apiClient";

/**
 * Log in with email + password via the backend API.
 * @returns {Promise<{email: string}>} the logged-in user
 */
export async function login(email, password) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return { email: data.email };
}

/** Log out via the backend API and clear token. */
export async function logout() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch {
    // Continue clearing local token even if request fails
  } finally {
    setToken(null);
  }
}

/**
 * Change the password of the logged-in user.
 */
export async function changePassword(currentPassword, newPassword) {
  await apiRequest("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/**
 * Returns the currently authenticated user from the backend, or null.
 * @returns {Promise<{email: string} | null>}
 */
export async function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const data = await apiRequest("/api/auth/me");
    return { email: data.email };
  } catch {
    setToken(null);
    return null;
  }
}
