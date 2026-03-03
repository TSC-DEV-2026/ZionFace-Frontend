import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

export async function checkHealth() {
  const { data } = await api.get("/face/health");
  return data;
}

export async function enrollFace(userId, file, append = false) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post(`/face/enroll/${encodeURIComponent(userId)}?append=${append ? "true" : "false"}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function verifyFace(userId, file) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post(`/face/verify/${encodeURIComponent(userId)}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function identifyFace(file, topK = 5) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post(`/face/identify?top_k=${Number(topK)}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function authLogin(payload) {
  const { data } = await api.post("/auth/login", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function authRegister(payload) {
  const { data } = await api.post("/auth/register", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

export async function authMe() {
  const { data } = await api.get("/auth/me");
  return data;
}
