'use client';

import { create } from 'zustand';
import { IEmiReminder, LoanType } from '@/types/emi.types';

interface EmiState {
  emis: IEmiReminder[];
  selectedEmiId: string | null;
  isAddEmiModalOpen: boolean;
  isEmiDetailsModalOpen: boolean;
  filterLoanType: LoanType | 'all';
  searchQuery: string;
  isLoading: boolean;

  // Actions
  setEmis: (emis: IEmiReminder[]) => void;
  addEmi: (emi: IEmiReminder) => void;
  updateEmiInStore: (id: string, updated: Partial<IEmiReminder>) => void;
  removeEmiFromStore: (id: string) => void;
  setSelectedEmiId: (id: string | null) => void;
  setIsAddEmiModalOpen: (open: boolean) => void;
  setIsEmiDetailsModalOpen: (open: boolean) => void;
  setFilterLoanType: (type: LoanType | 'all') => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useEmiStore = create<EmiState>((set) => ({
  emis: [],
  selectedEmiId: null,
  isAddEmiModalOpen: false,
  isEmiDetailsModalOpen: false,
  filterLoanType: 'all',
  searchQuery: '',
  isLoading: false,

  setEmis: (emis) => set({ emis }),
  addEmi: (emi) => set((state) => ({ emis: [emi, ...state.emis] })),
  updateEmiInStore: (id, updated) =>
    set((state) => ({
      emis: state.emis.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      ),
    })),
  removeEmiFromStore: (id) =>
    set((state) => ({
      emis: state.emis.filter((item) => item.id !== id),
      selectedEmiId: state.selectedEmiId === id ? null : state.selectedEmiId,
    })),
  setSelectedEmiId: (selectedEmiId) => set({ selectedEmiId }),
  setIsAddEmiModalOpen: (isAddEmiModalOpen) => set({ isAddEmiModalOpen }),
  setIsEmiDetailsModalOpen: (isEmiDetailsModalOpen) =>
    set({ isEmiDetailsModalOpen }),
  setFilterLoanType: (filterLoanType) => set({ filterLoanType }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
