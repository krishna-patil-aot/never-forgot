'use client';

import { useState, useCallback } from 'react';
import { IAppMetadata } from '@/types/about.types';

const defaultAppMetadata: IAppMetadata = {
  title: 'NeverForgot',
  shortDescription:
    'Universal bill, warranty, and insurance expiry vault built so you never forget your payment dates, renewal deadlines, or free warranty claims.',
  version: 'v1.0.0',
  releaseYear: '2026',
  owner: {
    name: 'Krishna Patil',
    role: 'Creator & Software Engineer',
    linkedinUrl: 'https://www.linkedin.com/in/krishnapatil-dev',
  },
  techStack: [
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Shadcn UI',
    'Zustand',
    'Date-fns',
  ],
};

export function useAppMetadata() {
  const [metadata] = useState<IAppMetadata>(defaultAppMetadata);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return {
    metadata,
    isExpanded,
    setIsExpanded,
    toggleExpanded,
  };
}
