'use client';

import { create } from 'zustand';
import { AuthMode, AuthStep, IUserProfile } from '@/types/auth.types';

interface AuthState {
  user: IUserProfile | null;
  authStep: AuthStep;
  authMode: AuthMode;
  identifier: string; // email or phone number
  otpCode: string;
  isAuthModalOpen: boolean;

  setAuthStep: (step: AuthStep) => void;
  setAuthMode: (mode: AuthMode) => void;
  setIdentifier: (identifier: string) => void;
  setOtpCode: (code: string) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  loginAsMockUser: () => void;
  logout: () => void;
  updateProfile: (profile: Partial<IUserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'user-default',
    email: 'krishna.patil@example.com',
    fullName: 'Krishna Patil',
    phone: '+91 98765 43210',
    role: 'user',
    isProfileComplete: true,
    notificationEmailEnabled: true,
    notificationInAppEnabled: true,
  },
  authStep: 'authenticated',
  authMode: 'email',
  identifier: '',
  otpCode: '',
  isAuthModalOpen: false,

  setAuthStep: (authStep) => set({ authStep }),
  setAuthMode: (authMode) => set({ authMode }),
  setIdentifier: (identifier) => set({ identifier }),
  setOtpCode: (otpCode) => set({ otpCode }),
  setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),

  loginAsMockUser: () =>
    set({
      user: {
        id: 'user-default',
        email: 'krishna.patil@example.com',
        fullName: 'Krishna Patil',
        role: 'user',
        isProfileComplete: true,
        notificationEmailEnabled: true,
        notificationInAppEnabled: true,
      },
      authStep: 'authenticated',
      isAuthModalOpen: false,
    }),

  logout: () =>
    set({
      user: null,
      authStep: 'identifier_input',
      identifier: '',
      otpCode: '',
    }),

  updateProfile: (updated) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updated } : null,
    })),
}));
