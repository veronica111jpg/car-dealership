// Single place that talks to the FastAPI backend.
const BASE_URL = "http://localhost:8000";

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  // The JWT goes in the Authorization header on protected requests.
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null; // DELETE returns no body

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // FastAPI sends a string, or a list of validation errors (422).
    const detail = data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : "Something went wrong";
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}