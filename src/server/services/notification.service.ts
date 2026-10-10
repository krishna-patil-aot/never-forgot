import moment from 'moment';
import { prisma } from '@/lib/prisma';
import { AssetCategory } from '@/types/asset.types';
import { NotificationType } from '@/types/notification.types';
import { EmailService } from './email.service';

export class NotificationService {
  /**
   * Run automated expiry check on user's assets and dispatch reminder notifications
   * Automatically triggers:
   * 1. 7 Days before expiration ("before 7 day")
   * 2. 1 Last day before expiration ("one last day before expired")
   */
  static async checkAndGenerateAlerts(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        notificationEmailEnabled: true,
      },
    });

    const assets = await prisma.asset.findMany({
      where: { userId },
      include: {
        serviceMilestones: {
          where: { status: 'pending' },
        },
        policyDetails: true,
      },
    });

    const emis = await prisma.emiReminder.findMany({
      where: { userId, status: 'active' },
    });

    const existingNotifications = await prisma.notification.findMany({
      where: { userId },
      select: {
        id: true,
        assetId: true,
        emiId: true,
        type: true,
        link: true,
        title: true,
        createdAt: true,
      },
    });

    // Track which milestones have already been dispatched to prevent duplicate spam
    const existingMap = new Set<string>();
    for (const notif of existingNotifications) {
      const notifMonth = moment(notif.createdAt).format('YYYY-MM');
      const linkMonthMatch = notif.link?.match(/month=([0-9]{4}-[0-9]{2})/);
      const linkMonth = linkMonthMatch ? linkMonthMatch[1] : notifMonth;

      if (notif.assetId) {
        existingMap.add(`${notif.assetId}_${notif.type}`);
        if (
          notif.link?.includes('milestone=7d') ||
          notif.title.includes('7-Day Reminder') ||
          notif.type === 'expiry_warning_7d'
        ) {
          existingMap.add(`${notif.assetId}_warranty_expiry_7d`);
        }
        if (
          notif.link?.includes('milestone=1d') ||
          notif.title.includes('Final Notice') ||
          notif.title.includes('1-Day') ||
          notif.type === 'expiry_warning_1d'
        ) {
          existingMap.add(`${notif.assetId}_warranty_expiry_1d`);
        }
        if (
          notif.link?.includes('milestone=expired') ||
          notif.title.includes('Coverage Expired')
        ) {
          existingMap.add(`${notif.assetId}_warranty_expiry_expired`);
        }
      }

      if (notif.emiId) {
        existingMap.add(`${notif.emiId}_${notif.type}`);
        existingMap.add(`${notif.emiId}_${notif.type}_${notifMonth}`);
        existingMap.add(`${notif.emiId}_${notif.type}_${linkMonth}`);

        if (
          notif.link?.includes('milestone=7d') ||
          notif.title.includes('7-Day') ||
          notif.type === 'emi_reminder_7d'
        ) {
          existingMap.add(`${notif.emiId}_emi_7d`);
          existingMap.add(`${notif.emiId}_emi_7d_${notifMonth}`);
          existingMap.add(`${notif.emiId}_emi_7d_${linkMonth}`);
        }
        if (
          notif.link?.includes('milestone=1d') ||
          notif.title.includes('1-Day') ||
          notif.title.includes('Urgent') ||
          notif.type === 'emi_reminder_1d'
        ) {
          existingMap.add(`${notif.emiId}_emi_1d`);
          existingMap.add(`${notif.emiId}_emi_1d_${notifMonth}`);
          existingMap.add(`${notif.emiId}_emi_1d_${linkMonth}`);
        }
      }
    }

    let generatedCount = 0;
    const nowMoment = moment().startOf('day');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://never-forgot.vercel.app/';

    for (const asset of assets) {
      const expiryMoment = moment(asset.expiryOrRenewalDate).startOf('day');
      const diffDays = expiryMoment.diff(nowMoment, 'days');
      const formattedDate = expiryMoment.format('DD MMMM YYYY');

      // -------------------------------------------------------------
      // 1. AUTOMATED 7-DAY ADVANCE REMINDER ("before 7 day")
      // -------------------------------------------------------------
      if (diffDays <= 7 && diffDays > 1) {
        const key7d = `${asset.id}_warranty_expiry_7d`;
        if (!existingMap.has(key7d)) {
          await prisma.notification.create({
            data: {
              userId,
              assetId: asset.id,
              title: `⚠️ 7-Day Reminder: ${asset.title}`,
              message: `Warranty coverage for ${asset.title} expires in ${diffDays} days on ${formattedDate}. Check the condition and file any warranty claims or service requests now.`,
              category: asset.category,
              type: 'warranty_expiry',
              link: `/#${asset.id}?milestone=7d`,
            },
          });
          existingMap.add(key7d);
          generatedCount++;

          // Automated email reminder dispatch (no manual trigger required)
          if (user?.email && user.notificationEmailEnabled) {
            EmailService.sendWarrantyExpiryAlert({
              recipientName: user.fullName || 'Valued User',
              recipientEmail: user.email,
              assetTitle: asset.title,
              brandOrProvider: asset.providerOrBrand,
              category: asset.category,
              expiryDate: formattedDate,
              daysRemaining: diffDays,
              identifierNumber: asset.identifierNumber || undefined,
              price: asset.price || undefined,
              actionUrl: `${appUrl}#${asset.id}`,
            }).catch((err: Error) => {
              console.error('[NotificationService] Automated 7-day reminder email failed:', err.message);
            });
          }
        }
      }

      // -------------------------------------------------------------
      // 2. AUTOMATED 1-DAY FINAL NOTICE ("one last day before expired")
      // -------------------------------------------------------------
      if (diffDays <= 1 && diffDays >= 0) {
        const key1d = `${asset.id}_warranty_expiry_1d`;
        if (!existingMap.has(key1d)) {
          const dayLabel = diffDays === 0 ? 'today' : 'tomorrow';
          await prisma.notification.create({
            data: {
              userId,
              assetId: asset.id,
              title: `🚨 Final Notice: ${asset.title} expires ${dayLabel}!`,
              message: `Urgent: Warranty for ${asset.title} expires ${dayLabel} (${formattedDate}). This is your last day to claim free replacement, parts, or repairs.`,
              category: asset.category,
              type: 'warranty_expiry',
              link: `/#${asset.id}?milestone=1d`,
            },
          });
          existingMap.add(key1d);
          generatedCount++;

          // Automated urgent final notice email dispatch
          if (user?.email && user.notificationEmailEnabled) {
            EmailService.sendWarrantyExpiryAlert({
              recipientName: user.fullName || 'Valued User',
              recipientEmail: user.email,
              assetTitle: asset.title,
              brandOrProvider: asset.providerOrBrand,
              category: asset.category,
              expiryDate: formattedDate,
              daysRemaining: diffDays,
              identifierNumber: asset.identifierNumber || undefined,
              price: asset.price || undefined,
              actionUrl: `${appUrl}#${asset.id}`,
            }).catch((err: Error) => {
              console.error('[NotificationService] Automated 1-day final notice email failed:', err.message);
            });
          }
        }
      }

      // -------------------------------------------------------------
      // 3. POST-EXPIRY LAPSED NOTIFICATION
      // -------------------------------------------------------------
      if (diffDays < 0 && diffDays >= -14) {
        const keyExpired = `${asset.id}_warranty_expiry_expired`;
        if (!existingMap.has(keyExpired)) {
          await prisma.notification.create({
            data: {
              userId,
              assetId: asset.id,
              title: `Coverage Expired: ${asset.title}`,
              message: `Warranty coverage for ${asset.title} expired on ${formattedDate} (${Math.abs(diffDays)} days ago).`,
              category: asset.category,
              type: 'warranty_expiry',
              link: `/#${asset.id}?milestone=expired`,
            },
          });
          existingMap.add(keyExpired);
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

      // 4. Upcoming service milestones
      for (const ms of asset.serviceMilestones) {
        const msMoment = moment(ms.dueDate).startOf('day');
        const msDiff = msMoment.diff(nowMoment, 'days');
        if (msDiff >= 0 && msDiff <= 30) {
          const msKey = `${ms.id}_service_due`;
          if (!existingMap.has(msKey)) {
            await prisma.notification.create({
              data: {
                userId,
                assetId: asset.id,
                title: `Service Due: ${ms.title}`,
                message: `Scheduled service for ${asset.title} is due in ${msDiff} days (${msMoment.format('DD MMMM YYYY')}).`,
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

    // =============================================================
    // 5. AUTOMATED EMI INSTALLMENT REMINDERS (7-Day and 1-Day Notice)
    // =============================================================
    const currentYearMonth = nowMoment.format('YYYY-MM');

    for (const emi of emis) {
      const isPaidThisMonth = emi.lastPaidMonth === currentYearMonth;
      if (isPaidThisMonth) continue;

      const currentMonthDue = moment()
        .date(Math.min(emi.dueDay, moment().daysInMonth()))
        .startOf('day');

      let targetDueDate = currentMonthDue;
      if (nowMoment.isAfter(currentMonthDue, 'day')) {
        const nextMonth = moment().add(1, 'month');
        targetDueDate = nextMonth
          .date(Math.min(emi.dueDay, nextMonth.daysInMonth()))
          .startOf('day');
      }

      const emiDiff = targetDueDate.diff(nowMoment, 'days');
      const formattedEmiDate = targetDueDate.format('DD MMMM YYYY');

      // 1. 7-Day Reminder
      if (emiDiff <= 7 && emiDiff > 1) {
        const targetMonth = targetDueDate.format('YYYY-MM');
        const key7d = `${emi.id}_emi_7d_${targetMonth}`;
        const alreadyDispatched =
          existingMap.has(key7d) ||
          existingMap.has(`${emi.id}_emi_7d`) ||
          existingMap.has(`${emi.id}_emi_reminder_7d_${targetMonth}`) ||
          existingNotifications.some(
            (n) =>
              n.emiId === emi.id &&
              (n.type === 'emi_reminder_7d' || n.link?.includes('milestone=7d')) &&
              moment(n.createdAt).format('YYYY-MM') === targetMonth
          );

        if (!alreadyDispatched) {
          await prisma.notification.create({
            data: {
              userId,
              emiId: emi.id,
              title: `⚠️ 7-Day EMI Reminder: ${emi.title}`,
              message: `Monthly EMI of ₹${emi.emiAmount.toLocaleString('en-IN')} for ${emi.title} (${emi.lenderName}) is due in ${emiDiff} days on ${formattedEmiDate}. Ensure sufficient balance for payment.`,
              category: 'emi',
              type: 'emi_reminder_7d',
              link: `/#emi-${emi.id}?milestone=7d&month=${targetMonth}`,
            },
          });
          existingMap.add(key7d);
          existingMap.add(`${emi.id}_emi_7d`);
          existingMap.add(`${emi.id}_emi_reminder_7d_${targetMonth}`);
          generatedCount++;

          if (user?.email && user.notificationEmailEnabled) {
            EmailService.sendEmiReminderAlert({
              recipientName: user.fullName || 'Valued Member',
              recipientEmail: user.email,
              emiTitle: emi.title,
              lenderName: emi.lenderName,
              loanType: emi.loanType,
              emiAmount: emi.emiAmount,
              dueDate: formattedEmiDate,
              daysRemaining: emiDiff,
              accountNumber: emi.accountNumber || undefined,
              actionUrl: `${appUrl}#emi-${emi.id}`,
            }).catch((err: Error) => {
              console.error('[NotificationService] Automated 7-day EMI email failed:', err.message);
            });
          }
        }
      }

      // 2. 1-Day Urgent Notice
      if (emiDiff <= 1 && emiDiff >= 0) {
        const targetMonth = targetDueDate.format('YYYY-MM');
        const key1d = `${emi.id}_emi_1d_${targetMonth}`;
        const alreadyDispatched =
          existingMap.has(key1d) ||
          existingMap.has(`${emi.id}_emi_1d`) ||
          existingMap.has(`${emi.id}_emi_reminder_1d_${targetMonth}`) ||
          existingNotifications.some(
            (n) =>
              n.emiId === emi.id &&
              (n.type === 'emi_reminder_1d' || n.link?.includes('milestone=1d')) &&
              moment(n.createdAt).format('YYYY-MM') === targetMonth
          );

        if (!alreadyDispatched) {
          const dayLabel = emiDiff === 0 ? 'today' : 'tomorrow';
          await prisma.notification.create({
            data: {
              userId,
              emiId: emi.id,
              title: `🚨 Urgent: ${emi.title} EMI due ${dayLabel}!`,
              message: `Urgent: EMI installment of ₹${emi.emiAmount.toLocaleString('en-IN')} for ${emi.title} (${emi.lenderName}) is due ${dayLabel} (${formattedEmiDate}). Please keep funds ready to avoid penalties.`,
              category: 'emi',
              type: 'emi_reminder_1d',
              link: `/#emi-${emi.id}?milestone=1d&month=${targetMonth}`,
            },
          });
          existingMap.add(key1d);
          existingMap.add(`${emi.id}_emi_1d`);
          existingMap.add(`${emi.id}_emi_reminder_1d_${targetMonth}`);
          generatedCount++;

          if (user?.email && user.notificationEmailEnabled) {
            EmailService.sendEmiReminderAlert({
              recipientName: user.fullName || 'Valued Member',
              recipientEmail: user.email,
              emiTitle: emi.title,
              lenderName: emi.lenderName,
              loanType: emi.loanType,
              emiAmount: emi.emiAmount,
              dueDate: formattedEmiDate,
              daysRemaining: emiDiff,
              accountNumber: emi.accountNumber || undefined,
              actionUrl: `${appUrl}#emi-${emi.id}`,
            }).catch((err: Error) => {
              console.error('[NotificationService] Automated 1-day urgent EMI email failed:', err.message);
            });
          }
        }
      }
    }

    return generatedCount;
  }

  /**
   * Proactively scan ALL users in the system and dispatch automated 7-day and 1-day reminders
   * Can be invoked by cron scheduler, daily background worker, or API endpoint
   */
  static async checkAllUsersExpiringAssets(): Promise<{ scannedUsers: number; generatedAlerts: number }> {
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    let totalAlerts = 0;
    for (const u of users) {
      try {
        const count = await this.checkAndGenerateAlerts(u.id);
        totalAlerts += count;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown scan error';
        console.error(`[NotificationService] Error scanning user ${u.id}:`, errMsg);
      }
    }

    return { scannedUsers: users.length, generatedAlerts: totalAlerts };
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
