'use client';

import { create } from 'zustand';
import { IProfileFormStore } from '@/types/profileForm.types';

export const useProfileFormStore = create<IProfileFormStore>((set) => ({
  fullName: '',
  phone: '',
  notificationEmailEnabled: true,
  notificationInAppEnabled: true,

  setFullName: (fullName) => set({ fullName }),
  setPhone: (phone) => set({ phone }),
  setNotificationEmailEnabled: (notificationEmailEnabled) =>
    set({ notificationEmailEnabled }),
  setNotificationInAppEnabled: (notificationInAppEnabled) =>
    set({ notificationInAppEnabled }),

  initFromUser: (user) => {
    if (user) {
      set({
        fullName: user.fullName || '',
        phone: user.phone || '',
        notificationEmailEnabled: user.notificationEmailEnabled,
        notificationInAppEnabled: user.notificationInAppEnabled,
      });
    }
  },
}));
