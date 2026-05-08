import axios from "axios";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "https://food-delivery-backend-qb69.onrender.com").replace(/\/$/, "");

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
