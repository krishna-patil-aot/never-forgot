'use client';

import { useEffect, useCallback } from 'react';
import { useEmiStore } from '@/stores/useEmiStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { IEmiReminder, ICreateEmiDto } from '@/types/emi.types';
import { IApiResponse } from '@/types/api.types';

export function useEmiApi() {
  const user = useAuthStore((state) => state.user);
  const {
    emis,
    setEmis,
    addEmi,
    updateEmiInStore,
    removeEmiFromStore,
    isLoading,
    setIsLoading,
  } = useEmiStore();

  const fetchEmis = useCallback(async () => {
    if (!user) {
      setEmis([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/emis');
      if (res.ok) {
        const json: IApiResponse<IEmiReminder[]> =
          (await res.json()) as IApiResponse<IEmiReminder[]>;
        if (json.success && json.data) {
          setEmis(json.data);
        }
      }
    } catch (err) {
      console.warn('[useEmiApi] Failed to fetch EMIs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user, setEmis, setIsLoading]);

  useEffect(() => {
    void fetchEmis();
  }, [fetchEmis]);

  const createEmi = useCallback(
    async (dto: ICreateEmiDto): Promise<boolean> => {
      if (!user) return false;

      try {
        const res = await fetch('/api/emis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        if (res.ok) {
          const json: IApiResponse<IEmiReminder> =
            (await res.json()) as IApiResponse<IEmiReminder>;
          if (json.success && json.data) {
            addEmi(json.data);
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('[useEmiApi] Failed to create EMI:', err);
        return false;
      }
    },
    [user, addEmi]
  );

  const togglePaidEmi = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/emis/${id}/pay`, {
          method: 'POST',
        });

        if (res.ok) {
          const json: IApiResponse<IEmiReminder> =
            (await res.json()) as IApiResponse<IEmiReminder>;
          if (json.success && json.data) {
            updateEmiInStore(id, json.data);
            return true;
          }
        }
        return false;
      } catch (err) {
        console.error('[useEmiApi] Failed to toggle EMI paid:', err);
        return false;
      }
    },
    [updateEmiInStore]
  );

  const deleteEmi = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/emis/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          removeEmiFromStore(id);
          return true;
        }
        return false;
      } catch (err) {
        console.error('[useEmiApi] Failed to delete EMI:', err);
        return false;
      }
    },
    [removeEmiFromStore]
  );

  return {
    emis,
    isLoading,
    fetchEmis,
    createEmi,
    togglePaidEmi,
    deleteEmi,
  };
}
