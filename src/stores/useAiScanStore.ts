'use client';

import { create } from 'zustand';
import {
  IAiExtractionResult,
  IScanPayload,
  ScanStatus,
} from '@/types/ai.types';

interface AiScanState {
  scanStatus: ScanStatus;
  scanPayload: IScanPayload | null;
  scanProgressText: string;
  extractedData: IAiExtractionResult | null;
  isScanModalOpen: boolean;
  isReviewModalOpen: boolean;
  isViewDocOpen: boolean;
  errorMessage: string | null;
  isDragOver: boolean;

  // Actions
  setIsDragOver: (isDragOver: boolean) => void;
  setIsScanModalOpen: (open: boolean) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  setIsViewDocOpen: (open: boolean) => void;
  setCloudinaryUrl: (url: string) => void;
  startScan: (payload: IScanPayload) => void;
  setScanningProgress: (text: string) => void;
  setScanSuccess: (data: IAiExtractionResult) => void;
  setScanError: (error: string) => void;
  updateExtractedField: <K extends keyof IAiExtractionResult>(
    key: K,
    value: IAiExtractionResult[K]
  ) => void;
  resetScan: () => void;
}

export const useAiScanStore = create<AiScanState>((set) => ({
  scanStatus: 'idle',
  scanPayload: null,
  scanProgressText: '',
  extractedData: null,
  isScanModalOpen: false,
  isReviewModalOpen: false,
  isViewDocOpen: false,
  errorMessage: null,
  isDragOver: false,

  setIsDragOver: (isDragOver) => set({ isDragOver }),
  setIsScanModalOpen: (isScanModalOpen) => set({ isScanModalOpen }),
  setIsReviewModalOpen: (isReviewModalOpen) => set({ isReviewModalOpen }),
  setIsViewDocOpen: (isViewDocOpen) => set({ isViewDocOpen }),

  setCloudinaryUrl: (url) =>
    set((state) => ({
      scanPayload: state.scanPayload
        ? { ...state.scanPayload, cloudinaryUrl: url }
        : null,
    })),

  startScan: (scanPayload) =>
    set({
      scanPayload,
      scanStatus: 'uploading',
      scanProgressText: 'Preparing invoice document...',
      errorMessage: null,
    }),

  setScanningProgress: (scanProgressText) =>
    set({ scanStatus: 'scanning', scanProgressText }),

  setScanSuccess: (extractedData) =>
    set({
      extractedData,
      scanStatus: 'review',
      isReviewModalOpen: true,
      scanProgressText: 'Information extracted successfully!',
    }),

  setScanError: (errorMessage) =>
    set({
      scanStatus: 'error',
      errorMessage,
      scanProgressText: '',
    }),

  updateExtractedField: (key, value) =>
    set((state) => {
      if (!state.extractedData) return state;
      return {
        extractedData: {
          ...state.extractedData,
          [key]: value,
        },
      };
    }),

  resetScan: () =>
    set({
      scanStatus: 'idle',
      scanPayload: null,
      scanProgressText: '',
      extractedData: null,
      isReviewModalOpen: false,
      isViewDocOpen: false,
      errorMessage: null,
    }),
}));
