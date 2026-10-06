import { prisma } from '@/lib/prisma';
import { IAnalyticsSummary } from '@/types/api.types';
import { AssetCategory } from '@/types/asset.types';
import { computeExpiryStatus } from './asset.repository';

export class AnalyticsRepository {
  /**
   * Compute comprehensive dashboard metrics and insights from database
   */
  static async getSummary(userId: string): Promise<IAnalyticsSummary> {
    const assets = await prisma.asset.findMany({
      where: { userId },
      include: {
        serviceMilestones: {
          where: {
            status: 'pending',
          },
        },
        policyDetails: true,
      },
      orderBy: { expiryOrRenewalDate: 'asc' },
    });

    let activeCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;
    let totalProtectedValue = 0;

    const categoryBreakdown: Record<AssetCategory, number> = {
      electronics: 0,
      vehicle: 0,
      health_insurance: 0,
      life_insurance: 0,
      home_amc: 0,
      personal_doc: 0,
    };

    let nextExpiringAssetTitle: string | null = null;
    let daysToNextExpiry: number | null = null;
    let upcomingMilestonesCount = 0;

    const now = new Date();

    for (const asset of assets) {
      // Dynamic status based on current real time
      const status = computeExpiryStatus(asset.expiryOrRenewalDate);
      if (status === 'active') activeCount++;
      else if (status === 'expiring_soon') expiringSoonCount++;
      else if (status === 'expired') expiredCount++;

      // Category counts
      const cat = asset.category as AssetCategory;
      if (categoryBreakdown[cat] !== undefined) {
        categoryBreakdown[cat]++;
      }

      // Financial value (asset purchase price or insurance sum insured)
      if (asset.price) {
        totalProtectedValue += asset.price;
      } else if (asset.policyDetails?.sumInsured) {
        totalProtectedValue += asset.policyDetails.sumInsured;
      }

      // Next expiring non-expired asset
      const diffMs = asset.expiryOrRenewalDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && daysToNextExpiry === null) {
        daysToNextExpiry = diffDays;
        nextExpiringAssetTitle = asset.title;
      }

      // Upcoming service milestones in next 45 days
      for (const ms of asset.serviceMilestones) {
        const msDiff = Math.ceil((ms.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (msDiff >= 0 && msDiff <= 45) {
          upcomingMilestonesCount++;
        }
      }
    }

    return {
      totalAssetsTracked: assets.length,
      activeCount,
      expiringSoonCount,
      expiredCount,
      totalProtectedValue,
      categoryBreakdown,
      upcomingMilestonesCount,
      daysToNextExpiry,
      nextExpiringAssetTitle,
    };
  }
}
