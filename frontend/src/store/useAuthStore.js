import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  // ✅ Login action
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ Check auth on app load
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check", {
        withCredentials: true,
      });
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error checking authentication:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
