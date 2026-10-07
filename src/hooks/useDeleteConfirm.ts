'use client';

import { useState, useCallback } from 'react';
import { useAssetStore } from '@/stores/useAssetStore';
import { useAssetApi } from '@/hooks/useAssetApi';
import { IUniversalAsset } from '@/types/asset.types';

export interface IUseDeleteConfirmReturn {
  assetToDelete: IUniversalAsset | null;
  isDeleteModalOpen: boolean;
  isDeleting: boolean;
  error: string | null;
  openDeleteModal: (asset: IUniversalAsset) => void;
  closeDeleteModal: () => void;
  confirmDelete: () => Promise<boolean>;
}

export function useDeleteConfirm(): IUseDeleteConfirmReturn {
  const assetToDelete = useAssetStore((state) => state.assetToDelete);
  const isDeleteModalOpen = useAssetStore((state) => state.isDeleteModalOpen);
  const setAssetToDelete = useAssetStore((state) => state.setAssetToDelete);
  const setIsDeleteModalOpen = useAssetStore((state) => state.setIsDeleteModalOpen);
  const setIsDetailsModalOpen = useAssetStore((state) => state.setIsDetailsModalOpen);
  const { deleteAsset } = useAssetApi();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openDeleteModal = useCallback(
    (asset: IUniversalAsset) => {
      setError(null);
      setAssetToDelete(asset);
      setIsDeleteModalOpen(true);
    },
    [setAssetToDelete, setIsDeleteModalOpen]
  );

  const closeDeleteModal = useCallback(() => {
    if (isDeleting) return;
    setError(null);
    setIsDeleteModalOpen(false);
    setAssetToDelete(null);
  }, [isDeleting, setIsDeleteModalOpen, setAssetToDelete]);

  const confirmDelete = useCallback(async (): Promise<boolean> => {
    if (!assetToDelete) return false;

    setIsDeleting(true);
    setError(null);

    try {
      const success = await deleteAsset(assetToDelete.id);
      if (success) {
        setIsDetailsModalOpen(false);
        setIsDeleteModalOpen(false);
        setAssetToDelete(null);
        return true;
      } else {
        setError('Failed to delete this item. Please try again.');
        return false;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error deleting item';
      setError(msg);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [assetToDelete, deleteAsset, setIsDetailsModalOpen, setIsDeleteModalOpen, setAssetToDelete]);

  return {
    assetToDelete,
    isDeleteModalOpen,
    isDeleting,
    error,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
}
