'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  IUserProfile,
  ILoginCredentialsDto,
  IRegisterDto,
  ISendOtpDto,
  IVerifyOtpDto,
  IForgotPasswordDto,
  IResetPasswordDto,
  IGoogleAuthDto,
  IUpdateProfileDto,
  IAuthApiResponse,
  AuthTab,
} from '@/types/auth.types';

export interface IUseAuthReturn {
  user: IUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingSession: boolean;
  error: string | null;
  successMessage: string | null;
  alreadyRegistered: boolean;
  otpCooldown: number;
  activeTab: AuthTab;
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;

  // Modal controls
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openForgotPasswordModal: () => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  setActiveTab: (tab: AuthTab) => void;
  clearMessages: () => void;

  // Auth Operations
  loginWithPassword: (credentials: ILoginCredentialsDto) => Promise<boolean>;
  registerAccount: (dto: IRegisterDto) => Promise<boolean>;
  loginWithGoogle: (googleData: IGoogleAuthDto) => Promise<boolean>;
  sendOtpCode: (dto: ISendOtpDto) => Promise<boolean>;
  verifyOtpCode: (dto: IVerifyOtpDto) => Promise<boolean>;
  requestForgotPasswordOtp: (dto: IForgotPasswordDto) => Promise<boolean>;
  submitResetPassword: (dto: IResetPasswordDto) => Promise<boolean>;
  updateUserProfile: (dto: IUpdateProfileDto) => Promise<boolean>;
  logoutUser: () => Promise<void>;
}

export function useAuth(): IUseAuthReturn {
  const user = useAuthStore((state) => state.user);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const activeTab = useAuthStore((state) => state.activeTab);
  const isAuthModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const isProfileModalOpen = useAuthStore((state) => state.isProfileModalOpen);

  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoadingSession = useAuthStore((state) => state.setIsLoadingSession);
  const setActiveTab = useAuthStore((state) => state.setActiveTab);
  const setIsAuthModalOpen = useAuthStore((state) => state.setIsAuthModalOpen);
  const setIsProfileModalOpen = useAuthStore((state) => state.setIsProfileModalOpen);
  const storeLogout = useAuthStore((state) => state.logout);
  const updateProfileState = useAuthStore((state) => state.updateProfileState);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState<boolean>(false);
  const [otpCooldown, setOtpCooldown] = useState<number>(0);

  // Check initial active session on page mount
  useEffect(() => {
    let ignore = false;

    fetch('/api/auth/me')
      .then((res) => res.json() as Promise<IAuthApiResponse>)
      .then((data) => {
        if (!ignore) {
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
          setIsLoadingSession(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setUser(null);
          setIsLoadingSession(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [setUser, setIsLoadingSession]);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    setAlreadyRegistered(false);
  }, []);

  const openLoginModal = useCallback(() => {
    clearMessages();
    setActiveTab('login');
    setIsAuthModalOpen(true);
  }, [clearMessages, setActiveTab, setIsAuthModalOpen]);

  const openRegisterModal = useCallback(() => {
    clearMessages();
    setActiveTab('register');
    setIsAuthModalOpen(true);
  }, [clearMessages, setActiveTab, setIsAuthModalOpen]);

  const openForgotPasswordModal = useCallback(() => {
    clearMessages();
    setActiveTab('forgot_password');
    setIsAuthModalOpen(true);
  }, [clearMessages, setActiveTab, setIsAuthModalOpen]);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    clearMessages();
  }, [setIsAuthModalOpen, clearMessages]);

  const openProfileModal = useCallback(() => {
    clearMessages();
    setIsProfileModalOpen(true);
  }, [clearMessages, setIsProfileModalOpen]);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
    clearMessages();
  }, [setIsProfileModalOpen, clearMessages]);

  // 1. Password-based Login
  const loginWithPassword = useCallback(
    async (credentials: ILoginCredentialsDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (!res.ok || !data.success || !data.user) {
          setError(data.message || 'Login failed');
          setIsLoading(false);
          return false;
        }

        setUser(data.user);
        setSuccessMessage('Welcome back!');
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Login failed';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages, setUser, setIsAuthModalOpen]
  );

  // 2. Account Registration with Duplicate Check
  const registerAccount = useCallback(
    async (dto: IRegisterDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (res.status === 409 || data.alreadyRegistered) {
          setAlreadyRegistered(true);
          setError(
            data.message ||
              'An account with this email already exists. Please log in.'
          );
          setIsLoading(false);
          return false;
        }

        if (!res.ok || !data.success || !data.user) {
          setError(data.message || 'Registration failed');
          setIsLoading(false);
          return false;
        }

        setUser(data.user);
        setSuccessMessage('Account created successfully!');
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages, setUser, setIsAuthModalOpen]
  );

  // 3. Google Gmail Login
  const loginWithGoogle = useCallback(
    async (googleData: IGoogleAuthDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(googleData),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (!res.ok || !data.success || !data.user) {
          setError(data.message || 'Google sign-in failed');
          setIsLoading(false);
          return false;
        }

        setUser(data.user);
        setSuccessMessage('Logged in with Google successfully!');
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Google sign-in failed';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages, setUser, setIsAuthModalOpen]
  );

  // 4. Send 6-Digit OTP Code
  const sendOtpCode = useCallback(
    async (dto: ISendOtpDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (!res.ok || !data.success) {
          setError(data.message || 'Failed to dispatch OTP');
          setIsLoading(false);
          return false;
        }

        setSuccessMessage(data.message);
        setOtpCooldown(60); // 60 seconds cooldown
        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to send OTP';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages]
  );

  // 5. Verify 6-Digit OTP Code
  const verifyOtpCode = useCallback(
    async (dto: IVerifyOtpDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (!res.ok || !data.success) {
          setError(data.message || 'OTP verification failed');
          setIsLoading(false);
          return false;
        }

        if (dto.purpose === 'login' && data.user) {
          setUser(data.user);
          setSuccessMessage('Logged in successfully!');
          setIsAuthModalOpen(false);
        } else {
          setSuccessMessage(data.message);
        }

        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'OTP verification failed';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages, setUser, setIsAuthModalOpen]
  );

  // 6. Request Forgot Password OTP
  const requestForgotPasswordOtp = useCallback(
    async (dto: IForgotPasswordDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (!res.ok || !data.success) {
          setError(data.message || 'Unable to process password reset request');
          setIsLoading(false);
          return false;
        }

        setSuccessMessage(data.message);
        setOtpCooldown(60);
        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to request password reset';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages]
  );

  // 7. Submit Reset Password with OTP
  const submitResetPassword = useCallback(
    async (dto: IResetPasswordDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (!res.ok || !data.success) {
          setError(data.message || 'Password reset failed');
          setIsLoading(false);
          return false;
        }

        setSuccessMessage(data.message);
        setActiveTab('login');
        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Password reset failed';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages, setActiveTab]
  );

  // 8. Update User Profile
  const updateUserProfile = useCallback(
    async (dto: IUpdateProfileDto): Promise<boolean> => {
      setIsLoading(true);
      clearMessages();

      try {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        const data = (await res.json()) as IAuthApiResponse;

        if (!res.ok || !data.success || !data.user) {
          setError(data.message || 'Failed to update profile');
          setIsLoading(false);
          return false;
        }

        updateProfileState(data.user);
        setSuccessMessage('Profile saved successfully!');
        setIsLoading(false);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update profile';
        setError(msg);
        setIsLoading(false);
        return false;
      }
    },
    [clearMessages, updateProfileState]
  );

  // 9. Logout
  const logoutUser = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      storeLogout();
      setIsLoading(false);
      clearMessages();
    }
  }, [storeLogout, clearMessages]);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    isLoadingSession,
    error,
    successMessage,
    alreadyRegistered,
    otpCooldown,
    activeTab,
    isAuthModalOpen,
    isProfileModalOpen,

    openLoginModal,
    openRegisterModal,
    openForgotPasswordModal,
    closeAuthModal,
    openProfileModal,
    closeProfileModal,
    setActiveTab,
    clearMessages,

    loginWithPassword,
    registerAccount,
    loginWithGoogle,
    sendOtpCode,
    verifyOtpCode,
    requestForgotPasswordOtp,
    submitResetPassword,
    updateUserProfile,
    logoutUser,
  };
}
