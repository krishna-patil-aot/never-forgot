import { z } from 'zod';
import { IUserProfile } from '@/types/auth.types';
import { isOptionalValidGlobalPhone } from '@/lib/phoneValidation';

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name cannot exceed 80 characters'),
  phone: z
    .string()
    .refine(
      (val) => isOptionalValidGlobalPhone(val),
      {
        message:
          'Please enter a valid global standard phone number with country code (e.g. +1 555 123 4567 or +91 98765 43210)',
      }
    ),
  notificationEmailEnabled: z.boolean(),
  notificationInAppEnabled: z.boolean(),
});

export type IProfileHookFormData = z.infer<typeof profileFormSchema>;

export interface IProfileFormState {
  fullName: string;
  phone: string;
  notificationEmailEnabled: boolean;
  notificationInAppEnabled: boolean;
}

export interface IProfileFormActions {
  setFullName: (fullName: string) => void;
  setPhone: (phone: string) => void;
  setNotificationEmailEnabled: (enabled: boolean) => void;
  setNotificationInAppEnabled: (enabled: boolean) => void;
  initFromUser: (user: IUserProfile | null) => void;
}

export type IProfileFormStore = IProfileFormState & IProfileFormActions;
