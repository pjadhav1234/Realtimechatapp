// lib/axios.js or wherever you create your instance
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // ✅ this is required
});
