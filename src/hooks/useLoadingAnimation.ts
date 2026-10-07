'use client';

import { useState, useEffect } from 'react';

const LOADING_STEPS: readonly string[] = [
  'Connecting to your secure vault...',
  'Loading bills, warranties & policies...',
  'Checking upcoming expiration dates...',
  'Preparing your interactive dashboard...',
] as const;

export interface IUseLoadingAnimationReturn {
  progress: number;
  currentStepMessage: string;
  stepIndex: number;
}

export function useLoadingAnimation(): IUseLoadingAnimationReturn {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(18);

  useEffect(() => {
    // Cycle through messages every 1.2 seconds
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1200);

    // Smooth simulated progress bar ease
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        const increment = Math.max(2, Math.floor((95 - prev) * 0.15));
        return Math.min(92, prev + increment);
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return {
    progress,
    currentStepMessage: LOADING_STEPS[stepIndex] ?? LOADING_STEPS[0],
    stepIndex,
  };
}
