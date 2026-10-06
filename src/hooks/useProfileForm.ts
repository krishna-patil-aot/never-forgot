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

  const onValidSubmit: SubmitHandler<IProfileHookFormData> = async (data) => {
    await updateUserProfile(data);
  };

  const handleLogout = React.useCallback(async () => {
    await logoutUser();
  }, [logoutUser]);

  return {
    form,
    register,
    handleSubmit: hookFormSubmit(onValidSubmit),
    setValue,
    user,
    isProfileModalOpen,
    isLoading,
    error,
    successMessage,
    handleLogout,
    closeProfileModal,
    clearMessages,
  };
}
