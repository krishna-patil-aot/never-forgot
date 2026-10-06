'use client';

import { useState, useEffect, useCallback } from 'react';
import { IApiResponse } from '@/types/api.types';
import { INotification } from '@/types/notification.types';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useAuthStore } from '@/stores/useAuthStore';

export interface IUseNotificationApiReturn {
  isLoading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
}

export function useNotificationApi(): IUseNotificationApiReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const markStoreAsRead = useNotificationStore((state) => state.markAsRead);
  const markStoreAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const user = useAuthStore((state) => state.user);

  // Initial load via async subscription
  useEffect(() => {
    let ignore = false;

    fetch('/api/notifications')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<IApiResponse<INotification[]>>;
      })
      .then((json) => {
        if (!ignore && json.success && json.data) {
          useNotificationStore.setState({ notifications: json.data });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Error fetching notifications';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = (await res.json()) as IApiResponse<INotification[]>;
        if (json.success && json.data) {
          useNotificationStore.setState({ notifications: json.data });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async (id: string): Promise<boolean> => {
      markStoreAsRead(id);
      try {
        const res = await fetch(`/api/notifications/${id}/read`, {
          method: 'PATCH',
        });
        return res.ok;
      } catch (err) {
        console.warn('Failed to sync notification read state to server', err);
        return false;
      }
    },
    [markStoreAsRead]
  );

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    markStoreAllAsRead();
    try {
      const res = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      return res.ok;
    } catch (err) {
      console.warn('Failed to sync mark-all-read to server', err);
      return false;
    }
  }, [markStoreAllAsRead]);

  return {
    isLoading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  };
}
