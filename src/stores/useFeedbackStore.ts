import { create } from 'zustand';

interface IFeedbackStore {
  isFeedbackModalOpen: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
}

export const useFeedbackStore = create<IFeedbackStore>((set) => ({
  isFeedbackModalOpen: false,
  openFeedbackModal: () => set({ isFeedbackModalOpen: true }),
  closeFeedbackModal: () => set({ isFeedbackModalOpen: false }),
}));
