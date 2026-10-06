'use client';

import { useMemo, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useNotificationApi } from '@/hooks/useNotificationApi';
import { INotification } from '@/types/notification.types';

export interface IUseNotificationDrawerReturn {
  notifications: INotification[];
  unreadCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleMarkAsRead: (id: string) => void;
  handleMarkAllAsRead: () => void;
  handleClose: () => void;
}

export function useNotificationDrawer(): IUseNotificationDrawerReturn {
  const notifications = useNotificationStore((state) => state.notifications);
  const isOpen = useNotificationStore((state) => state.isNotificationPanelOpen);
  const setIsOpen = useNotificationStore((state) => state.setIsNotificationPanelOpen);

  const { markAsRead, markAllAsRead } = useNotificationApi();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleMarkAsRead = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleClose,
  };
}
