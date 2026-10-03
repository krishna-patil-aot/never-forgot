'use client';

import { create } from 'zustand';
import { INotification } from '@/types/notification.types';

const INITIAL_NOTIFICATIONS: INotification[] = [
  {
    id: 'notif-1',
    assetId: 'asset-1',
    assetTitle: 'Apple iPhone 15 Pro',
    category: 'electronics',
    type: 'warranty_expiry',
    title: 'Warranty Expiring in 12 Days',
    message: 'Your Apple 1-Year Limited Warranty expires on October 15, 2026. Review extension options.',
    dueDate: '2026-10-15T00:00:00.000Z',
    daysRemaining: 12,
    isRead: false,
    priority: 'high',
    createdAt: '2026-10-03T08:00:00.000Z',
  },
  {
    id: 'notif-2',
    assetId: 'asset-4',
    assetTitle: 'Kent Grand Plus RO',
    category: 'home_amc',
    type: 'service_due',
    title: 'RO Filter Service Due in 7 Days',
    message: 'Carbon & Sediment Filter replacement is scheduled for October 10, 2026.',
    dueDate: '2026-10-10T00:00:00.000Z',
    daysRemaining: 7,
    isRead: false,
    priority: 'medium',
    createdAt: '2026-10-02T10:00:00.000Z',
  },
  {
    id: 'notif-3',
    assetId: 'asset-3',
    assetTitle: 'Star Health Optima Secure',
    category: 'health_insurance',
    type: 'policy_renewal',
    title: 'Health Policy Renewal Coming Up',
    message: 'Premium of ₹24,500 is due on November 19, 2026 to keep no-claim bonus active.',
    dueDate: '2026-11-19T00:00:00.000Z',
    daysRemaining: 47,
    isRead: true,
    priority: 'low',
    createdAt: '2026-09-28T09:00:00.000Z',
  },
];

interface NotificationState {
  notifications: INotification[];
  isNotificationPanelOpen: boolean;

  setIsNotificationPanelOpen: (open: boolean) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  isNotificationPanelOpen: false,

  setIsNotificationPanelOpen: (isNotificationPanelOpen) =>
    set({ isNotificationPanelOpen }),

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
