'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useAuthFormStore } from '@/stores/useAuthFormStore';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { AuthTab } from '@/types/auth.types';

export interface IAuthHookFormData {
  email: string;
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
  otpCode?: string;
}

export function useAuthModalForm() {
  const {
    isAuthModalOpen,
    activeTab,
    isLoading,
    error,
    successMessage,
    alreadyRegistered,
    otpCooldown,
    closeAuthModal,
    setActiveTab,
    clearMessages,
    loginWithPassword,
    registerAccount,
    sendOtpCode,
    verifyOtpCode,
    requestForgotPasswordOtp,
    submitResetPassword,
  } = useAuth();

  const {
    showPassword,
    isOtpLoginMode,
    isOtpSent,
    setShowPassword,
    setIsOtpLoginMode,
    setIsOtpSent,
    resetPasswordsAndOtp,
  } = useAuthFormStore();

  const form = useForm<IAuthHookFormData>({
    defaultValues: {
      email: '',
      password: '',
      newPassword: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      otpCode: '',
    },
    mode: 'onTouched',
  });

  const { register, handleSubmit: hookFormSubmit, setValue, getValues, reset } = form;

  const {
    triggerGoogleSignIn,
    authError: googleAuthError,
    isLoading: isGoogleLoading,
    clearGoogleError,
  } = useGoogleAuth();

  const handleTabChange = React.useCallback(
    (tab: AuthTab) => {
      setActiveTab(tab);
      clearMessages();
      clearGoogleError();
      resetPasswordsAndOtp();
      setValue('password', '');
      setValue('newPassword', '');
      setValue('confirmPassword', '');
      setValue('otpCode', '');
    },
    [setActiveTab, clearMessages, clearGoogleError, resetPasswordsAndOtp, setValue]
  );

  const toggleShowPassword = React.useCallback(() => {
    setShowPassword(!showPassword);
  }, [setShowPassword, showPassword]);

  const toggleOtpLoginMode = React.useCallback(() => {
    setIsOtpLoginMode(!isOtpLoginMode);
    setIsOtpSent(false);
    clearMessages();
    clearGoogleError();
  }, [setIsOtpLoginMode, isOtpLoginMode, setIsOtpSent, clearMessages, clearGoogleError]);

  const handleGoogleSignIn = React.useCallback(() => {
    clearMessages();
    triggerGoogleSignIn();
  }, [clearMessages, triggerGoogleSignIn]);

  const handleResendOtp = React.useCallback(async () => {
    const currentEmail = getValues('email');
    if (otpCooldown > 0 || isLoading || !currentEmail) return;
    if (activeTab === 'login') {
      await sendOtpCode({ email: currentEmail, purpose: 'login' });
    } else if (activeTab === 'forgot_password') {
      await requestForgotPasswordOtp({ email: currentEmail });
    }
  }, [otpCooldown, isLoading, getValues, activeTab, sendOtpCode, requestForgotPasswordOtp]);

  const onValidSubmit = async (data: IAuthHookFormData) => {
    const currentEmail = data.email;

    if (activeTab === 'login') {
      if (isOtpLoginMode) {
        if (!isOtpSent) {
          const sent = await sendOtpCode({ email: currentEmail, purpose: 'login' });
          if (sent) setIsOtpSent(true);
        } else {
          await verifyOtpCode({ email: currentEmail, code: data.otpCode || '', purpose: 'login' });
        }
      } else {
        await loginWithPassword({ email: currentEmail, password: data.password || '' });
      }
    } else if (activeTab === 'register') {
      await registerAccount({
        email: currentEmail,
        fullName: data.fullName || '',
        password: data.password || undefined,
        phone: data.phone || undefined,
      });
    } else if (activeTab === 'forgot_password') {
      if (!isOtpSent) {
        const sent = await requestForgotPasswordOtp({ email: currentEmail });
        if (sent) setIsOtpSent(true);
      } else {
        if (data.newPassword !== data.confirmPassword) {
          return;
        }
        await submitResetPassword({
          email: currentEmail,
          code: data.otpCode || '',
          newPassword: data.newPassword || '',
        });
      }
    }
  };

  const handleCloseModal = React.useCallback(() => {
    closeAuthModal();
    resetPasswordsAndOtp();
    clearGoogleError();
    reset();
  }, [closeAuthModal, resetPasswordsAndOtp, clearGoogleError, reset]);

  const handleChangeEmail = React.useCallback(() => {
    setIsOtpSent(false);
    setValue('otpCode', '');
    clearMessages();
  }, [setIsOtpSent, setValue, clearMessages]);

  return {
    // React Hook Form tools
    form,
    register,
    handleSubmit: hookFormSubmit(onValidSubmit),
    setValue,

    // Form fields state
    showPassword,
    isOtpLoginMode,
    isOtpSent,

    // Status states
    isAuthModalOpen,
    activeTab,
    isLoading: isLoading || isGoogleLoading,
    isGoogleLoading,
    error: error || googleAuthError,
    googleAuthError,
    successMessage,
    alreadyRegistered,
    otpCooldown,

    // Handlers
    handleTabChange,
    toggleShowPassword,
    toggleOtpLoginMode,
    handleGoogleSignIn,
    handleResendOtp,
    handleChangeEmail,
    handleCloseModal,
    clearMessages,
  };
}
