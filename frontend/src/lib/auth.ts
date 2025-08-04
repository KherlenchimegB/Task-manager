import Cookies from "js-cookie";
import { User } from "../types";

// Token management
export const setAuthToken = (token: string) => {
  Cookies.set("auth-token", token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get("auth-token");
};

export const removeAuthToken = () => {
  Cookies.remove("auth-token");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// User data management (stored in localStorage for persistence)
export const setUserData = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user-data", JSON.stringify(user));
  }
};

export const getUserData = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user-data");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const removeUserData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user-data");
  }
};

// Complete logout
export const logout = () => {
  removeAuthToken();
  removeUserData();
  window.location.href = "/auth/login";
};
