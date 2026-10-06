'use client';

import { create } from 'zustand';
import { AuthMode, AuthTab, IUserProfile } from '@/types/auth.types';

interface AuthState {
  user: IUserProfile | null;
  isLoadingSession: boolean;
  activeTab: AuthTab;
  authMode: AuthMode;
  identifier: string; // email address
  otpCode: string;
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;

  setUser: (user: IUserProfile | null) => void;
  setIsLoadingSession: (loading: boolean) => void;
  setActiveTab: (tab: AuthTab) => void;
  setAuthMode: (mode: AuthMode) => void;
  setIdentifier: (identifier: string) => void;
  setOtpCode: (code: string) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openForgotPasswordModal: () => void;
  logout: () => void;
  updateProfileState: (profile: Partial<IUserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Zero static data — populated only from real live session
  isLoadingSession: true,
  activeTab: 'login',
  authMode: 'password',
  identifier: '',
  otpCode: '',
  isAuthModalOpen: false,
  isProfileModalOpen: false,

  setUser: (user) => set({ user, isLoadingSession: false }),
  setIsLoadingSession: (isLoadingSession) => set({ isLoadingSession }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setAuthMode: (authMode) => set({ authMode }),
  setIdentifier: (identifier) => set({ identifier }),
  setOtpCode: (otpCode) => set({ otpCode }),
  setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),
  setIsProfileModalOpen: (isProfileModalOpen) => set({ isProfileModalOpen }),

  openLoginModal: () =>
    set({
      activeTab: 'login',
      isAuthModalOpen: true,
      otpCode: '',
    }),

  openRegisterModal: () =>
    set({
      activeTab: 'register',
      isAuthModalOpen: true,
      otpCode: '',
    }),

  openForgotPasswordModal: () =>
    set({
      activeTab: 'forgot_password',
      isAuthModalOpen: true,
      otpCode: '',
    }),

  logout: () =>
    set({
      user: null,
      identifier: '',
      otpCode: '',
      isAuthModalOpen: false,
      isProfileModalOpen: false,
    }),

  updateProfileState: (updated) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updated } : null,
    })),
}));
