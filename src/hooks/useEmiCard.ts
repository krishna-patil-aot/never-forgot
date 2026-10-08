'use client';

import { useMemo, useCallback, useState } from 'react';
import {
  Home,
  Car,
  Bike,
  User,
  GraduationCap,
  Coins,
  Tv,
  Briefcase,
  CreditCard,
  LucideIcon,
} from 'lucide-react';
import { IEmiReminder, LoanType } from '@/types/emi.types';
import { useEmiStore } from '@/stores/useEmiStore';
import { useEmiApi } from './useEmiApi';

interface LoanVisualMeta {
  label: string;
  icon: LucideIcon;
  gradientBar: string;
  accentBg: string;
  iconColor: string;
}

export function getLoanVisualMeta(loanType: LoanType): LoanVisualMeta {
  switch (loanType) {
    case 'home_loan':
      return {
        label: 'Home Loan',
        icon: Home,
        gradientBar: 'from-blue-600 via-indigo-600 to-cyan-600',
        accentBg: 'bg-blue-50 border-blue-200 text-blue-700',
        iconColor: 'text-blue-700',
      };
    case 'car_loan':
      return {
        label: 'Car Loan',
        icon: Car,
        gradientBar: 'from-amber-500 via-orange-500 to-amber-600',
        accentBg: 'bg-amber-50 border-amber-200 text-amber-800',
        iconColor: 'text-amber-700',
      };
    case 'bike_loan':
      return {
        label: 'Bike / 2-Wheeler',
        icon: Bike,
        gradientBar: 'from-emerald-500 via-teal-500 to-emerald-600',
        accentBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        iconColor: 'text-emerald-700',
      };
    case 'education_loan':
      return {
        label: 'Education Loan',
        icon: GraduationCap,
        gradientBar: 'from-purple-500 via-indigo-500 to-purple-600',
        accentBg: 'bg-purple-50 border-purple-200 text-purple-800',
        iconColor: 'text-purple-700',
      };
    case 'gold_loan':
      return {
        label: 'Gold Loan',
        icon: Coins,
        gradientBar: 'from-yellow-500 via-amber-500 to-yellow-600',
        accentBg: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        iconColor: 'text-yellow-700',
      };
    case 'consumer_loan':
      return {
        label: 'Gadget / Consumer',
        icon: Tv,
        gradientBar: 'from-cyan-500 via-teal-500 to-cyan-600',
        accentBg: 'bg-cyan-50 border-cyan-200 text-cyan-800',
        iconColor: 'text-cyan-700',
      };
    case 'business_loan':
      return {
        label: 'Business Loan',
        icon: Briefcase,
        gradientBar: 'from-slate-600 via-zinc-600 to-slate-700',
        accentBg: 'bg-slate-100 border-slate-300 text-slate-800',
        iconColor: 'text-slate-700',
      };
    case 'personal_loan':
    case 'other':
    default:
      return {
        label: loanType === 'personal_loan' ? 'Personal Loan' : 'Loan EMI',
        icon: loanType === 'personal_loan' ? User : CreditCard,
        gradientBar: 'from-rose-500 via-pink-500 to-rose-600',
        accentBg: 'bg-rose-50 border-rose-200 text-rose-800',
        iconColor: 'text-rose-700',
      };
  }
}

export function useEmiCard(emi: IEmiReminder) {
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const setSelectedEmiId = useEmiStore((state) => state.setSelectedEmiId);
  const setIsEmiDetailsModalOpen = useEmiStore(
    (state) => state.setIsEmiDetailsModalOpen
  );
  const { togglePaidEmi, deleteEmi } = useEmiApi();

  const visualMeta = useMemo(() => getLoanVisualMeta(emi.loanType), [emi.loanType]);

  const dueLabel = useMemo(() => {
    if (emi.isPaidThisMonth) {
      return 'Paid this Month';
    }
    if (emi.daysUntilDue === 0) {
      return 'Due Today!';
    }
    if (emi.daysUntilDue === 1) {
      return 'Due Tomorrow!';
    }
    return `Due in ${emi.daysUntilDue} days`;
  }, [emi.isPaidThisMonth, emi.daysUntilDue]);

  const handleOpenDetails = useCallback(() => {
    setSelectedEmiId(emi.id);
    setIsEmiDetailsModalOpen(true);
  }, [emi.id, setSelectedEmiId, setIsEmiDetailsModalOpen]);

  const handleTogglePaid = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void togglePaidEmi(emi.id);
    },
    [emi.id, togglePaidEmi]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm(`Are you sure you want to remove "${emi.title}"?`)) {
        void deleteEmi(emi.id);
      }
    },
    [emi.id, emi.title, deleteEmi]
  );

  const handleOpenDoc = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDocViewerOpen(true);
  }, []);

  return {
    visualMeta,
    dueLabel,
    isDocViewerOpen,
    setIsDocViewerOpen,
    handleOpenDetails,
    handleTogglePaid,
    handleDelete,
    handleOpenDoc,
  };
}
