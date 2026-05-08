import axios from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const buildImageUrl = (image) =>
  image ? `${API_BASE_URL}/images/${image}` : "";

export const getAuthConfig = (token) => {
  if (!token || token === "undefined" || token === "null") {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
