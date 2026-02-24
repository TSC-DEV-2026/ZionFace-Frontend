// src/services/api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

export async function checkHealth() {
  const { data } = await api.get("/health");
  return data;
}

export async function enrollFace(userId, file, append = false) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post(`/face/enroll/${encodeURIComponent(userId)}`, form, {
    params: { append },
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

// ✅ NOVO: 1:N (sem user_id)
export async function identifyFace(file, topK = 5) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post(`/face/identify`, form, {
    params: { top_k: topK },
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}
