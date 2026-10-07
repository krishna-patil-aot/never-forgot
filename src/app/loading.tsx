'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Clock, Lock } from 'lucide-react';
import { AppLogo } from '@/components/ui/AppLogo';
import { useLoadingAnimation } from '@/hooks/useLoadingAnimation';

export default function Loading() {
  const { progress, currentStepMessage, stepIndex } = useLoadingAnimation();

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Ambient background soft glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl pointer-events-none" />

      {/* Main Glassmorphism Loading Hub */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-7 sm:space-y-8">
        {/* Animated Scanner Pulse Radar Hub */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Wave Ring 1 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: [0.9, 1.6, 2], opacity: [0.6, 0.25, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute h-28 w-28 rounded-3xl border-2 border-cyan-400/40 bg-cyan-100/20 pointer-events-none"
          />

          {/* Outer Pulsing Wave Ring 2 (Staggered) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: [0.9, 1.5, 1.9], opacity: [0.5, 0.2, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.8,
            }}
            className="absolute h-28 w-28 rounded-3xl border border-teal-400/30 bg-teal-100/15 pointer-events-none"
          />

          {/* Central Rotating Gradient Halo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-cyan-600 opacity-60 blur-xs"
          />

          {/* Central Glass Card Icon Container */}
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-24 w-24 rounded-3xl bg-white border border-cyan-200/80 shadow-xl shadow-cyan-600/15 flex items-center justify-center p-1 overflow-hidden"
          >
            {/* Holographic Scanning Laser Sweep */}
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_8px_#06b6d4] z-20 pointer-events-none"
            />

            <AppLogo size={56} className="rounded-2xl shadow-sm" />

            {/* Corner Micro Glow */}
            <span className="absolute bottom-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
          </motion.div>
        </div>

        {/* Dynamic Status Narrative Suite */}
        <div className="space-y-3 w-full px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-cyan-200/80 text-[11px] font-bold text-cyan-800 shadow-2xs">
            <Lock className="h-3 w-3 text-cyan-600" />
            <span>NeverForgot Secure Vault</span>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          </div>

          {/* Animated Text Switcher */}
          <div className="h-7 relative flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={stepIndex}
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight"
              >
                {currentStepMessage}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Fetching your warranties, bills, and auto-reminder timelines
          </p>
        </div>

        {/* Liquid Progress Track Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="relative h-2 w-full rounded-full bg-slate-200/80 overflow-hidden shadow-inner p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-400 relative overflow-hidden"
              initial={{ width: '12%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
            >
              {/* Shimmer Wave running along the progress bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: 'linear',
                }}
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-0.5">
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="h-3 w-3 text-cyan-600" />
              Syncing
            </span>
            <span className="font-mono text-cyan-700 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Friendly Benefit Hint Footer */}
        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            256-Bit Protection
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
            Zero Missed Expiries
          </span>
        </div>
      </div>
    </div>
  );
}
