'use client';

import * as React from 'react';
import { CreditCard, Plus, ShieldCheck, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmiStore } from '@/stores/useEmiStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function EmiEmptyState() {
  const setIsAddEmiModalOpen = useEmiStore((state) => state.setIsAddEmiModalOpen);
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  const handleAction = () => {
    if (!user) {
      openLoginModal();
    } else {
      setIsAddEmiModalOpen(true);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200/90 bg-white p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-2xs my-4">
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-cyan-700 shadow-sm">
        <CreditCard className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Track Your Loans & Monthly EMIs
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Stay on top of Home Loans, Car Loans, Two-Wheeler, and Personal Loans. Get automated alerts <strong>7 days</strong> and <strong>1 day before</strong> your payment date.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 pt-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 font-medium">
          <Bell className="h-3.5 w-3.5 text-cyan-600" />
          7 & 1 Day Prior Reminders
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
          Zero Credit Penalty
        </span>
      </div>

      <div className="pt-2">
        <Button
          onClick={handleAction}
          className="h-11 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-md shadow-cyan-600/20 text-sm cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Your First EMI Loan</span>
        </Button>
      </div>
    </div>
  );
}
