import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../api/authAPI";
import { isTokenExpired } from "../utils/jwt";
import { useNotificationStore } from "./notificationStore";
import type { User, AuthResponse } from "../api/authAPI";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  deleteUser: () => Promise<void>;
  clearError: () => void;
  checkTokenExpiration: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authAPI.signup(
            name,
            email,
            password,
          );
          set({
            user: {
              id: response.id,
              name: response.name,
              email: response.email,
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: (err as Error).message,
            isLoading: false,
          });
          throw err;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authAPI.login(email, password);
          set({
            user: {
              id: response.id,
              name: response.name,
              email: response.email,
            },
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          useNotificationStore
            .getState()
            .addNotification("Connexion réussie.", "success");
        } catch (err) {
          const errorMessage = (err as Error).message;
          set({
            error: errorMessage,
            isLoading: false,
          });
          useNotificationStore
            .getState()
            .addNotification(errorMessage, "error");
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authAPI.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          useNotificationStore
            .getState()
            .addNotification(
              "Vous avez été déconnecté avec succès.",
              "success",
            );
        } catch (err) {
          const errorMessage = (err as Error).message;
          set({
            error: errorMessage,
            isLoading: false,
          });
          useNotificationStore
            .getState()
            .addNotification(errorMessage, "error");
          throw err;
        }
      },

      requestPasswordReset: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.requestPasswordReset(email);
          set({ isLoading: false });
        } catch (err) {
          set({
            error: (err as Error).message,
            isLoading: false,
          });
          throw err;
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.resetPassword(token, password);
          set({ isLoading: false });
        } catch (err) {
          set({
            error: (err as Error).message,
            isLoading: false,
          });
          throw err;
        }
      },

      deleteUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = get().token;
          if (!token) throw new Error("No token available");
          await authAPI.deleteUser(token);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: (err as Error).message,
            isLoading: false,
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),

      checkTokenExpiration: () => {
        const { token, isAuthenticated } = get();
        if (token && isAuthenticated && isTokenExpired(token)) {
          // Token is expired, logout automatically
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          useNotificationStore
            .getState()
            .addNotification(
              "Vous avez été déconnecté en raison d'une inactivité prolongée. Veuillez vous reconnecter.",
              "info",
            );
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
