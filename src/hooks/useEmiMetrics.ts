'use client';

import { useMemo } from 'react';
import { useEmiStore } from '@/stores/useEmiStore';
import { IEmiMetrics } from '@/types/emi.types';

export function useEmiMetrics(): IEmiMetrics {
  const emis = useEmiStore((state) => state.emis);

  return useMemo(() => {
    let totalMonthlyOutflow = 0;
    let activeCount = 0;
    let upcomingDueCount = 0;
    let urgentDueCount = 0;
    let totalPrincipal = 0;
    let paidThisMonthCount = 0;

    for (const emi of emis) {
      if (emi.status === 'active') {
        activeCount++;
        totalMonthlyOutflow += emi.emiAmount;

        if (emi.totalLoanAmount) {
          totalPrincipal += emi.totalLoanAmount;
        }

        if (emi.isPaidThisMonth) {
          paidThisMonthCount++;
        } else {
          if (emi.isUrgent) {
            urgentDueCount++;
          } else if (emi.isDueSoon) {
            upcomingDueCount++;
          }
        }
      }
    }

    return {
      totalMonthlyOutflow,
      activeCount,
      upcomingDueCount,
      urgentDueCount,
      totalPrincipal,
      paidThisMonthCount,
    };
  }, [emis]);
}
