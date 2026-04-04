const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request(path, options = {}, token) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
}

export const api = {
  apiUrl: API_URL,
  register: (payload) => request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: (token) => request("/api/auth/me", {}, token),
  listVideos: (token, queryString = "") => request(`/api/videos${queryString}`, {}, token),
  uploadVideo: (token, formData) =>
    request("/api/videos", { method: "POST", body: formData }, token),
  updateVideo: (token, videoId, payload) =>
    request(`/api/videos/${videoId}`, { method: "PATCH", body: JSON.stringify(payload) }, token),
  listUsers: (token) => request("/api/users", {}, token),
  createUser: (token, payload) => request("/api/users", { method: "POST", body: JSON.stringify(payload) }, token)
};
