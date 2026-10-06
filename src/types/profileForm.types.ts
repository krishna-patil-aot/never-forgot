import { IUserProfile } from '@/types/auth.types';

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
