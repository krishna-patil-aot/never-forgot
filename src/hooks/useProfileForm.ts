'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

export interface IProfileHookFormData {
  fullName: string;
  phone: string;
  notificationEmailEnabled: boolean;
  notificationInAppEnabled: boolean;
}

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
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      notificationEmailEnabled: user?.notificationEmailEnabled ?? true,
      notificationInAppEnabled: user?.notificationInAppEnabled ?? true,
    },
  });

  const { register, handleSubmit: hookFormSubmit, setValue, reset } = form;

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
    const success = await updateUserProfile(data);
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
