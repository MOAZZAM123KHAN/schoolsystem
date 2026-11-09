/**
 * authService — ALL login logic lives in this file.
 *
 * WARNING: This localStorage login is TEMPORARY and NOT SECURE.
 * Passwords are stored as plain text in the browser and anyone who can open
 * the browser's developer tools can read or change them. It exists only so the
 * app can be built and tested before the backend exists.
 *
 * When the backend is ready, replace ONLY this file with real API calls
 * (POST /api/auth/login, etc.). Keep the same four exported functions and the
 * same return values, and no other file needs to change. No other file may
 * touch localStorage for login.
 */

const USERS_KEY = "rc_auth_users";
const SESSION_KEY = "rc_auth_session";

// First account, taken from frontend/.env
const DEFAULT_EMAIL = (import.meta.env.VITE_DEFAULT_EMAIL || "admin@school.com").toLowerCase();
const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD || "ChangeMe@123";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Returns the saved accounts, creating the default one on first use. */
function loadUsers() {
  const users = readJSON(USERS_KEY, null);
  if (users && users.length) return users;
  const seeded = [{ email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }];
  writeJSON(USERS_KEY, seeded);
  return seeded;
}

/**
 * Log in with email + password.
 * @returns {Promise<{email: string}>} the logged-in user
 * @throws {Error} with a clear message when the details are wrong
 */
export async function login(email, password) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const user = loadUsers().find((u) => u.email === cleanEmail);
  if (!user) throw new Error("No account found with this email.");
  if (user.password !== password) throw new Error("Wrong password. Please try again.");
  writeJSON(SESSION_KEY, { email: user.email });
  return { email: user.email };
}

/** Log out the current user. */
export async function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Change the password of the logged-in user.
 * @throws {Error} when not logged in or the current password is wrong
 */
export async function changePassword(currentPassword, newPassword) {
  const session = readJSON(SESSION_KEY, null);
  if (!session) throw new Error("You are not logged in.");
  const users = loadUsers();
  const user = users.find((u) => u.email === session.email);
  if (!user) throw new Error("Account not found.");
  if (user.password !== currentPassword) throw new Error("Current password is wrong.");
  user.password = newPassword;
  writeJSON(USERS_KEY, users);
}

/** @returns {Promise<{email: string} | null>} the logged-in user, or null */
export async function getCurrentUser() {
  const session = readJSON(SESSION_KEY, null);
  if (!session) return null;
  const exists = loadUsers().some((u) => u.email === session.email);
  return exists ? { email: session.email } : null;
}

