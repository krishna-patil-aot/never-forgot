'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFeedbackStore } from '@/stores/useFeedbackStore';
import {
  FeedbackCategory,
  IFeedbackSubmissionDto,
  IFeedbackApiResponse,
  IRatingTier,
  IDeviceDiagnosticInfo,
} from '@/types/feedback.types';

export const RATING_TIERS: IRatingTier[] = [
  { stars: 1, label: 'Very Poor', emoji: '😞', colorClass: 'text-rose-500' },
  { stars: 2, label: 'Needs Improvement', emoji: '😕', colorClass: 'text-amber-500' },
  { stars: 3, label: 'Average / Fair', emoji: '😐', colorClass: 'text-yellow-500' },
  { stars: 4, label: 'Good Experience', emoji: '😊', colorClass: 'text-teal-500' },
  { stars: 5, label: 'Excellent!', emoji: '🤩', colorClass: 'text-emerald-500' },
];

export const EXPERIENCE_SUGGESTION_TAGS = [
  'Easy to Track Warranties',
  'Fast Document Upload',
  'Clean & Beautiful UI',
  'Found a Bug',
  'Need WhatsApp Alerts',
  'Service Reminders are Great',
  'Slow in Some Areas',
  'Love the Google Sign-in',
];

export function useFeedbackForm() {
  const { user } = useAuth();
  const isFeedbackModalOpen = useFeedbackStore((state) => state.isFeedbackModalOpen);
  const closeFeedbackModal = useFeedbackStore((state) => state.closeFeedbackModal);
  const openFeedbackModal = useFeedbackStore((state) => state.openFeedbackModal);

  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [message, setMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const effectiveUserName = userName || user?.fullName || '';
  const effectiveUserEmail = userEmail || user?.email || '';

  // Toggle selection tag
  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  // Collect client device diagnostics
  const getDeviceDiagnostics = useCallback((): IDeviceDiagnosticInfo => {
    if (typeof window === 'undefined') return {};

    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Linux')) os = 'Linux';

    let browser = 'Unknown Browser';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Google Chrome';
    else if (ua.includes('Edg')) browser = 'Microsoft Edge';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Apple Safari';
    else if (ua.includes('Firefox')) browser = 'Mozilla Firefox';

    return {
      os,
      browser,
      screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
      currentPath: window.location.pathname,
      userAgent: ua.slice(0, 150),
    };
  }, []);

  // Reset form
  const handleResetForm = useCallback(() => {
    setRating(5);
    setHoveredRating(null);
    setCategory('general');
    setMessage('');
    setSelectedTags([]);
    setError(null);
    setIsSuccess(false);
    setSuccessMessage('');
  }, []);

  const handleClose = useCallback(() => {
    closeFeedbackModal();
    // Reset after transition finishes
    setTimeout(() => {
      handleResetForm();
    }, 300);
  }, [closeFeedbackModal, handleResetForm]);

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const finalName = (user?.fullName || userName).trim();
      const finalEmail = (user?.email || userEmail).trim();

      if (!finalName) {
        setError('Please enter your name before submitting feedback.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!finalEmail || !emailRegex.test(finalEmail)) {
        setError('Please enter a valid email address so our team can follow up with you.');
        return;
      }

      if (!message.trim()) {
        setError('Please describe your feedback or the issue you experienced.');
        return;
      }

      setIsSubmitting(true);

      try {
        const payload: IFeedbackSubmissionDto = {
          rating,
          category,
          message: message.trim(),
          userName: finalName,
          userEmail: finalEmail,
          selectedTags,
          deviceInfo: getDeviceDiagnostics(),
        };

        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = (await res.json()) as IFeedbackApiResponse;

        if (!res.ok || !data.success) {
          setError(data.message || 'Failed to submit feedback. Please try again.');
          setIsSubmitting(false);
          return;
        }

        setIsSuccess(true);
        setSuccessMessage(
          data.message || 'Thank you! Your feedback has been sent directly to the team.'
        );
        setIsSubmitting(false);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Network error submitting feedback';
        setError(errMsg);
        setIsSubmitting(false);
      }
    },
    [rating, category, message, userName, userEmail, selectedTags, user, getDeviceDiagnostics]
  );

  const activeRatingTier =
    RATING_TIERS.find((t) => t.stars === (hoveredRating || rating)) || RATING_TIERS[4];

  return {
    // Modal states
    isFeedbackModalOpen,
    openFeedbackModal,
    handleClose,

    // User auth status
    isUserLoggedIn: Boolean(user),
    user,

    // Form states
    rating,
    hoveredRating,
    setRating,
    setHoveredRating,
    category,
    setCategory,
    message,
    setMessage,
    userName: user?.fullName || effectiveUserName,
    setUserName,
    userEmail: user?.email || effectiveUserEmail,
    setUserEmail,
    selectedTags,
    handleToggleTag,

    // Status
    isSubmitting,
    error,
    isSuccess,
    successMessage,
    activeRatingTier,

    // Actions
    handleSubmit,
    handleResetForm,
  };
}
