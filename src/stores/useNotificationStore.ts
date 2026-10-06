'use client';

import { create } from 'zustand';
import { INotification } from '@/types/notification.types';

interface NotificationState {
  notifications: INotification[];
  isNotificationPanelOpen: boolean;

  setIsNotificationPanelOpen: (open: boolean) => void;
  setNotifications: (notifications: INotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [], // Pure live data — initialized empty, loaded from database API
  isNotificationPanelOpen: false,

  setIsNotificationPanelOpen: (isNotificationPanelOpen) =>
    set({ isNotificationPanelOpen }),

  setNotifications: (notifications) => set({ notifications }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
