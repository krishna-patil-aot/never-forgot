'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine,
  Sparkles,
  Plus,
  ShieldCheck,
  Clock,
  Wrench,
  CreditCard,
  CalendarClock,
  BadgePercent,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLogo } from '@/components/ui/AppLogo';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { useConsumerLayout } from '@/hooks/useSidebar';

export function HeroSection() {
  const { handleOpenAddModal, handleOpenScanModal, handleOpenAddEmiModal } =
    useProtectedAction();
  const { activeTab } = useConsumerLayout();

  const isEmi = activeTab === 'emi';

  const scrollToEmiGrid = () => {
    const el = document.getElementById('emi-tracker-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50/90 via-teal-50/50 to-white text-slate-900 shadow-sm border border-cyan-150/80 p-5 sm:p-8 md:p-10 transition-colors duration-500">
      {/* Ambient background soft glow */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-5 sm:space-y-6">
        <AnimatePresence mode="wait">
          {isEmi ? (
            <motion.div
              key="emi-hero"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="space-y-5 sm:space-y-6"
            >
              {/* Top Feature Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-white/95 text-teal-800 border-teal-200 px-3 py-1 text-xs font-bold gap-1.5 shadow-2xs"
                >
                  <CreditCard className="h-3.5 w-3.5 text-teal-600" />
                  <span>NeverForgot EMI Manager</span>
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                  7-Day & 1-Day Pre-Alerts Active
                </span>
              </div>

              {/* Hero Main Heading & Narrative */}
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
                  Never miss an upcoming{' '}
                  <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent underline decoration-teal-300 decoration-wavy decoration-2 animate-gradient-text font-black">
                    EMI installment or loan payment.
                  </span>
                </h1>
                <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
                  Track home loans, car finances, gadget installments, and education EMIs. Receive automated email and dashboard reminders 7 days and 1 day before due dates so you never pay penalty charges.
                </p>
              </div>



              {/* Desktop / Tablet Action Buttons Suite (hidden sm:flex) */}
              <div className="hidden sm:flex flex-row items-center gap-3 pt-1">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    size="lg"
                    onClick={handleOpenAddEmiModal}
                    className="h-11 sm:h-12 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 transition-all cursor-pointer flex items-center justify-center gap-2.5 text-sm touch-press"
                  >
                    <Plus className="h-4.5 w-4.5 text-white" />
                    <span>Add New EMI Loan</span>
                    <Sparkles className="h-4 w-4 text-teal-200 animate-spin" style={{ animationDuration: '6s' }} />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={scrollToEmiGrid}
                    className="h-11 sm:h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-2xs touch-press"
                  >
                    <CalendarClock className="h-4.5 w-4.5 text-teal-600" />
                    <span>View EMI Schedule</span>
                  </Button>
                </motion.div>
              </div>

              {/* Key Feature Benefits Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-teal-150/90">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="h-7 w-7 rounded-lg bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                    <CalendarClock className="h-3.5 w-3.5" />
                  </div>
                  <span>7-Day & 1-Day Pre-Alerts</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="h-7 w-7 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                    <BadgePercent className="h-3.5 w-3.5" />
                  </div>
                  <span>Principal & Interest Tracking</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="h-7 w-7 rounded-lg bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>Zero Late Fee Penalties</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="vault-hero"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="space-y-5 sm:space-y-6"
            >
              {/* Top Feature Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-white/95 text-cyan-800 border-cyan-200 px-3 py-1 text-xs font-bold gap-1.5 shadow-2xs"
                >
                  <AppLogo size={16} className="rounded-xs" />
                  <span>NeverForgot</span>
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-800">
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                  Active Reminders Ready
                </span>
              </div>

              {/* Hero Main Heading & Narrative */}
              <div className="space-y-2.5 sm:space-y-3">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
                  Never lose track of your{' '}
                  <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent underline decoration-cyan-300 decoration-wavy decoration-2 animate-gradient-text font-black">
                    bills, warranties & services.
                  </span>
                </h1>
                <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
                  Keep your electronics warranties, bike free service schedules, and insurance renewal dates in one safe place. We remind you on time so you never lose money.
                </p>
              </div>



              {/* Desktop / Tablet Action Buttons Suite (hidden sm:flex) */}
              <div className="hidden sm:flex flex-row items-center gap-3 pt-1">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    size="lg"
                    onClick={handleOpenScanModal}
                    className="h-11 sm:h-12 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md shadow-cyan-600/20 transition-all cursor-pointer flex items-center justify-center gap-2.5 text-sm touch-press"
                  >
                    <ScanLine className="h-4.5 w-4.5 text-white" />
                    <span>Scan Bill or Invoice</span>
                    <Sparkles className="h-4 w-4 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleOpenAddModal}
                    className="h-11 sm:h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-2xs touch-press"
                  >
                    <Plus className="h-4.5 w-4.5 text-cyan-600" />
                    <span>Add Item Manually</span>
                  </Button>
                </motion.div>
              </div>

              {/* Key Feature Benefits Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-cyan-150/90">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="h-7 w-7 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span>Early Expiry Reminders</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="h-7 w-7 rounded-lg bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                    <Wrench className="h-3.5 w-3.5" />
                  </div>
                  <span>Free Vehicle Service Tracking</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="h-7 w-7 rounded-lg bg-cyan-100/80 text-cyan-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span>Safe Cloud & Compression</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

