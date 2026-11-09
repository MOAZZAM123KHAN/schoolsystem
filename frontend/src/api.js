// Small helper for calling the Express API (proxied via Vite in development)
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export const api = {
  health: () => request("/health"),
  getStudents: () => request("/students"),
  createStudent: (body) => request("/students", { method: "POST", body: JSON.stringify(body) }),
  deleteStudent: (id) => request(`/students/${id}`, { method: "DELETE" }),
};

