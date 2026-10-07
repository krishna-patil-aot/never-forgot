import { prisma } from '@/lib/prisma';
import { AssetCategory } from '@/types/asset.types';
import { NotificationType } from '@/types/notification.types';

export class NotificationService {
  /**
   * Run proactive expiry check on user's assets and create notifications if approaching deadlines
   */
  static async checkAndGenerateAlerts(userId: string): Promise<number> {
    const assets = await prisma.asset.findMany({
      where: { userId },
      include: {
        serviceMilestones: {
          where: { status: 'pending' },
        },
        policyDetails: true,
      },
    });

    const existingNotifications = await prisma.notification.findMany({
      where: { userId },
      select: { assetId: true, type: true },
    });

    const existingMap = new Set(
      existingNotifications.map(
        (n: { assetId: string | null; type: string }) => `${n.assetId || ''}_${n.type}`
      )
    );

    let generatedCount = 0;
    const now = new Date();

    for (const asset of assets) {
      const diffMs = asset.expiryOrRenewalDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // 1. Critical 7-day or expired alert
      if (diffDays <= 7) {
        const key = `${asset.id}_warranty_expiry`;
        if (!existingMap.has(key)) {
          await prisma.notification.create({
            data: {
              userId,
              assetId: asset.id,
              title: diffDays < 0 ? `Coverage Expired: ${asset.title}` : `Urgent: ${asset.title} expires in ${diffDays} days`,
              message: diffDays < 0
                ? `Warranty coverage for ${asset.title} expired ${Math.abs(diffDays)} days ago.`
                : `Warranty coverage for ${asset.title} ends on ${asset.expiryOrRenewalDate.toISOString().split('T')[0]}. File any claims now.`,
              category: asset.category,
              type: 'warranty_expiry',
              link: `/#${asset.id}`,
            },
          });
          existingMap.add(key);
          generatedCount++;
        }
      }

      // 2. Insurance Policy renewal alert
      if (asset.policyDetails && diffDays <= 45) {
        const key = `${asset.id}_policy_renewal`;
        if (!existingMap.has(key)) {
          await prisma.notification.create({
            data: {
              userId,
              assetId: asset.id,
              title: `Policy Renewal: ${asset.title}`,
              message: `Annual premium of ₹${asset.policyDetails.premiumAmount.toLocaleString()} is due on ${asset.expiryOrRenewalDate.toISOString().split('T')[0]}.`,
              category: asset.category,
              type: 'policy_renewal',
              link: `/#${asset.id}`,
            },
          });
          existingMap.add(key);
          generatedCount++;
        }
      }

      // 3. Upcoming service milestones
      for (const ms of asset.serviceMilestones) {
        const msDiff = Math.ceil((ms.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (msDiff >= 0 && msDiff <= 30) {
          const msKey = `${ms.id}_service_due`;
          if (!existingMap.has(msKey)) {
            await prisma.notification.create({
              data: {
                userId,
                assetId: asset.id,
                title: `Service Due: ${ms.title}`,
                message: `Scheduled service for ${asset.title} is due in ${msDiff} days (${ms.dueDate.toISOString().split('T')[0]}).`,
                category: asset.category,
                type: 'service_due',
                link: `/#${asset.id}`,
              },
            });
            existingMap.add(msKey);
            generatedCount++;
          }
        }
      }
    }

    return generatedCount;
  }

  /**
   * Seed realistic initial notifications if none exist
   */
  static async seedInitialNotificationsIfEmpty(userId: string): Promise<void> {
    const count = await prisma.notification.count({ where: { userId } });
    if (count > 0) return;

    const sampleNotifications: Array<{
      title: string;
      message: string;
      category: AssetCategory;
      type: NotificationType;
    }> = [
      {
        title: 'Warranty expiring in 9 days',
        message: 'Apple iPhone 15 Pro standard 1-year coverage expires on 15 Oct 2026. File any pending display/battery claims now.',
        category: 'electronics',
        type: 'warranty_expiry',
      },
      {
        title: 'Health policy renewal due next month',
        message: 'Star Health Optima Secure renewal window is active. Grace period ends in 44 days.',
        category: 'health_insurance',
        type: 'policy_renewal',
      },
      {
        title: 'Free periodic service upcoming',
        message: 'Royal Enfield Hunter 350 second scheduled service (5,000km) is due on 28 Nov 2026.',
        category: 'vehicle',
        type: 'service_due',
      },
    ];

    for (const item of sampleNotifications) {
      await prisma.notification.create({
        data: {
          userId,
          title: item.title,
          message: item.message,
          category: item.category,
          type: item.type,
          isRead: false,
        },
      });
    }
  }
}
