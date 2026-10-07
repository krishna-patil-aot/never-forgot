'use client';

import * as React from 'react';
import { useFeedbackStore } from '@/stores/useFeedbackStore';
import { MessageSquareHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeedbackFloatingButton() {
  const openFeedbackModal = useFeedbackStore((state) => state.openFeedbackModal);

  return (
    <aside
      aria-label="User feedback widget"
      className="hidden md:flex fixed bottom-6 right-6 z-40 print:hidden"
    >
      <Button
        type="button"
        onClick={openFeedbackModal}
        className="group h-11 px-3.5 sm:px-4 rounded-2xl bg-white/95 hover:bg-white text-slate-800 border border-cyan-200/90 shadow-lg shadow-cyan-900/10 hover:shadow-xl hover:shadow-cyan-900/15 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        aria-label="Open feedback dialog"
      >
        {/* Animated Badge Icon */}
        <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-12 transition-transform">
          <MessageSquareHeart className="h-3.5 w-3.5" />
        </div>

        {/* Text */}
        <span className="text-xs font-bold tracking-tight text-slate-800">
          Feedback
        </span>

        {/* Subtle Star Accent */}
        <span className="hidden sm:inline-block text-[11px] text-amber-500 font-extrabold group-hover:scale-110 transition-transform">
          ★
        </span>
      </Button>
    </aside>
  );
}
