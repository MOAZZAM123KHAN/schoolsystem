const TOKEN_KEY = "rc_auth_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Reusable fetch wrapper for API requests.
 * Automatically adds JWT Authorization header and provides friendly error messages.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(endpoint, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Cannot connect to backend server. Make sure you started the app with 'npm run dev' or 'npm run dev:backend'."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      setToken(null);
    }
    if (response.status === 502) {
      throw new Error(
        "Backend server is not running on port 5000 (502 Bad Gateway). Please run 'npm run dev' in schoolsystem folder."
      );
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}
