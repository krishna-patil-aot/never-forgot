'use client';

import { create } from 'zustand';
import { IAuthFormStore } from '@/types/authForm.types';

const INITIAL_STATE = {
  email: '',
  password: '',
  newPassword: '',
  confirmPassword: '',
  fullName: '',
  phone: '',
  otpCode: '',
  showPassword: false,
  isOtpLoginMode: false,
  isOtpSent: false,
};

export const useAuthFormStore = create<IAuthFormStore>((set) => ({
  ...INITIAL_STATE,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setNewPassword: (newPassword) => set({ newPassword }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setFullName: (fullName) => set({ fullName }),
  setPhone: (phone) => set({ phone }),
  setOtpCode: (otpCode) => set({ otpCode }),
  setShowPassword: (showPassword) => set({ showPassword }),
  setIsOtpLoginMode: (isOtpLoginMode) => set({ isOtpLoginMode }),
  setIsOtpSent: (isOtpSent) => set({ isOtpSent }),

  resetPasswordsAndOtp: () =>
    set({
      password: '',
      newPassword: '',
      confirmPassword: '',
      otpCode: '',
      isOtpSent: false,
    }),

  resetAll: () => set({ ...INITIAL_STATE }),
}));
