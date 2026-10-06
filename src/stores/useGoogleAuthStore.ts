import { create } from 'zustand';
import { IGoogleAuthStore } from '@/types/googleAuth.types';

export const useGoogleAuthStore = create<IGoogleAuthStore>((set) => ({
  isLoading: false,
  authError: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setAuthError: (authError: string | null) => set({ authError }),
  resetState: () => set({ isLoading: false, authError: null }),
}));
