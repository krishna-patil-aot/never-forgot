'use client';

import { useState, useCallback } from 'react';
import { IAppMetadata } from '@/types/about.types';

const defaultAppMetadata: IAppMetadata = {
  title: 'NeverForgot',
  shortDescription:
    'A simple and easy way to keep your bills, warranties, bike free service schedules, and insurance renewal dates in one safe place so you never miss a deadline or lose money.',
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
    'React Hook Form',
    'Zustand',
    'Prisma',
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
