'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AppLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function AppLogo({
  size = 40,
  className,
  ...props
}: AppLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn('shrink-0 drop-shadow-sm select-none', className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="nf-app-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      {/* Background Squircle matching favicon */}
      <rect width="64" height="64" rx="16" fill="url(#nf-app-logo-grad)" />
      {/* Shield Silhouette */}
      <path
        d="M32 13C32 13 44 15.2 46 22.5C46 34.5 37 44.5 32 49.5C27 44.5 18 34.5 18 22.5C20 15.2 32 13 32 13Z"
        fill="white"
        fillOpacity="0.22"
      />
      {/* Bold Checkmark Sentinel */}
      <path
        d="M25 31L30 36L39 25"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Active Pulse Sparkle */}
      <circle cx="45" cy="18" r="2.5" fill="#38bdf8" />
    </svg>
  );
}
