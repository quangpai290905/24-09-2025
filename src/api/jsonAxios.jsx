// src/api/jsonAxios.js
import axios from "axios";

// Lấy baseURL từ .env, fallback sang DummyJSON (có dữ liệu sản phẩm)
const baseURL = import.meta.env.VITE_API_URL || "https://dummyjson.com";

export const jsonAxios = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});
