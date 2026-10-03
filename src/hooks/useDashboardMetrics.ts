'use client';

import { useMemo } from 'react';
import { useAssetStore } from '@/stores/useAssetStore';
import { AssetCategory } from '@/types/asset.types';

export interface IDashboardMetrics {
  totalAssetsCount: number;
  activeCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  totalProtectedValue: number;
  upcomingServicesCount: number;
  categoryBreakdown: Record<AssetCategory, number>;
}

export function useDashboardMetrics(): IDashboardMetrics {
  const assets = useAssetStore((state) => state.assets);

  return useMemo(() => {
    let totalProtectedValue = 0;
    let activeCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;
    let upcomingServicesCount = 0;

    const categoryBreakdown: Record<AssetCategory, number> = {
      electronics: 0,
      vehicle: 0,
      health_insurance: 0,
      life_insurance: 0,
      home_amc: 0,
      personal_doc: 0,
    };

    const now = new Date().getTime();

    assets.forEach((asset) => {
      // Category count
      if (categoryBreakdown[asset.category] !== undefined) {
        categoryBreakdown[asset.category] += 1;
      }

      // Value
      if (asset.price) {
        totalProtectedValue += asset.price;
      } else if (asset.policyDetails?.sumInsured) {
        totalProtectedValue += asset.policyDetails.sumInsured;
      }

      // Expiry status
      const expiryTime = new Date(asset.expiryOrRenewalDate).getTime();
      const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        expiredCount += 1;
      } else if (diffDays <= 30) {
        expiringSoonCount += 1;
      } else {
        activeCount += 1;
      }

      // Check upcoming service milestones
      if (asset.serviceMilestones && asset.serviceMilestones.length > 0) {
        asset.serviceMilestones.forEach((m) => {
          if (m.status === 'pending') {
            const milestoneTime = new Date(m.dueDate).getTime();
            const milestoneDiffDays = Math.ceil(
              (milestoneTime - now) / (1000 * 60 * 60 * 24)
            );
            if (milestoneDiffDays >= 0 && milestoneDiffDays <= 60) {
              upcomingServicesCount += 1;
            }
          }
        });
      }
    });

    return {
      totalAssetsCount: assets.length,
      activeCount,
      expiringSoonCount,
      expiredCount,
      totalProtectedValue,
      upcomingServicesCount,
      categoryBreakdown,
    };
  }, [assets]);
}
