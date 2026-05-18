import { create } from "zustand";

type NotificationType = "success" | "error" | "info";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (message, type = "info") =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          message,
          type,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
