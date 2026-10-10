'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { profileFormSchema, IProfileHookFormData } from '@/types/profileForm.types';
import { normalizeGlobalPhoneNumber } from '@/lib/phoneValidation';

export function useProfileForm() {
  const {
    user,
    isProfileModalOpen,
    isLoading,
    error,
    successMessage,
    closeProfileModal,
    updateUserProfile,
    logoutUser,
    clearMessages,
  } = useAuth();

  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const form = useForm<IProfileHookFormData>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      notificationEmailEnabled: user?.notificationEmailEnabled ?? true,
      notificationInAppEnabled: user?.notificationInAppEnabled ?? true,
    },
  });

  const {
    register,
    handleSubmit: hookFormSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = form;

  // Sync form when user updates or modal opens
  React.useEffect(() => {
    if (isProfileModalOpen && user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        notificationEmailEnabled: user.notificationEmailEnabled,
        notificationInAppEnabled: user.notificationInAppEnabled,
      });
    }
  }, [isProfileModalOpen, user, reset]);

  const startEditing = React.useCallback(() => {
    clearMessages();
    if (user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        notificationEmailEnabled: user.notificationEmailEnabled,
        notificationInAppEnabled: user.notificationInAppEnabled,
      });
    }
    setIsEditing(true);
  }, [clearMessages, user, reset]);

  const cancelEditing = React.useCallback(() => {
    clearMessages();
    if (user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        notificationEmailEnabled: user.notificationEmailEnabled,
        notificationInAppEnabled: user.notificationInAppEnabled,
      });
    }
    setIsEditing(false);
  }, [clearMessages, user, reset]);

  const handleClose = React.useCallback(() => {
    setIsEditing(false);
    clearMessages();
    closeProfileModal();
  }, [clearMessages, closeProfileModal]);

  const onValidSubmit: SubmitHandler<IProfileHookFormData> = async (data) => {
    // Normalize phone number to standard E.164 canonical format if provided
    const normalizedPhone = data.phone && data.phone.trim()
      ? normalizeGlobalPhoneNumber(data.phone)
      : '';

    const success = await updateUserProfile({
      fullName: data.fullName.trim(),
      phone: normalizedPhone,
      notificationEmailEnabled: data.notificationEmailEnabled,
      notificationInAppEnabled: data.notificationInAppEnabled,
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleLogout = React.useCallback(async () => {
    setIsEditing(false);
    await logoutUser();
  }, [logoutUser]);

  return {
    form,
    register,
    handleSubmit: hookFormSubmit(onValidSubmit),
    setValue,
    errors,
    isValid,
    isSubmitting: isSubmitting || isLoading,
    user,
    isProfileModalOpen,
    isEditing,
    startEditing,
    cancelEditing,
    handleClose,
    isLoading,
    error,
    successMessage,
    handleLogout,
    closeProfileModal: handleClose,
    clearMessages,
  };
}
