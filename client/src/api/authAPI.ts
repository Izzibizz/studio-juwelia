const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const authAPI = {
  signup: async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Signup failed");
    }
    return res.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }
    return res.json();
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/auth/request-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Reset request failed");
    }
    return res.json();
  },

  resetPassword: async (
    token: string,
    password: string,
  ): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Password reset failed");
    }
    return res.json();
  },

  deleteUser: async (token: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/auth/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Delete failed");
    }
    return res.json();
  },
};
