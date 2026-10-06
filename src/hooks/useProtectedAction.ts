'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAssetStore } from '@/stores/useAssetStore';
import { useAiScanStore } from '@/stores/useAiScanStore';

export interface IUseProtectedActionReturn {
  isAuthenticated: boolean;
  requireAuth: (action: () => void) => void;
  handleOpenAddModal: () => void;
  handleOpenScanModal: () => void;
}

/**
 * Ensures only authenticated users can trigger actions like
 * scanning documents or adding assets. If unauthenticated, opens the Auth modal.
 */
export function useProtectedAction(): IUseProtectedActionReturn {
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const setIsAddModalOpen = useAssetStore((state) => state.setIsAddModalOpen);
  const setIsScanModalOpen = useAiScanStore((state) => state.setIsScanModalOpen);

  const isUserLoggedIn = Boolean(user);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (!isUserLoggedIn) {
        openLoginModal();
        return;
      }
      action();
    },
    [isUserLoggedIn, openLoginModal]
  );

  const handleOpenAddModal = useCallback(() => {
    requireAuth(() => {
      setIsAddModalOpen(true);
    });
  }, [requireAuth, setIsAddModalOpen]);

  const handleOpenScanModal = useCallback(() => {
    requireAuth(() => {
      setIsScanModalOpen(true);
    });
  }, [requireAuth, setIsScanModalOpen]);

  return {
    isAuthenticated: isUserLoggedIn,
    requireAuth,
    handleOpenAddModal,
    handleOpenScanModal,
  };
}
