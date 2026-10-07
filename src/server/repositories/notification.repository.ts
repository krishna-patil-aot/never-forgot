import { prisma } from '@/lib/prisma';
import type { Notification as PrismaNotification } from '@prisma/client';
import { INotification, NotificationType, NotificationPriority } from '@/types/notification.types';
import { AssetCategory } from '@/types/asset.types';

export class NotificationRepository {
  /**
   * Fetch all notifications for user, sorted newest first
   */
  static async findMany(userId: string): Promise<INotification[]> {
    const raw = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map((n: PrismaNotification) => {
      // Approximate dueDate from notification timestamp or default
      const createdAtDate = n.createdAt;
      const daysRemaining = 14;

      let priority: NotificationPriority = 'medium';
      if (n.type === 'warranty_expiry') priority = 'high';
      else if (n.type === 'policy_renewal') priority = 'medium';
      else priority = 'low';

      return {
        id: n.id,
        assetId: n.assetId || 'asset-default',
        assetTitle: n.title,
        category: n.category as AssetCategory,
        type: (['warranty_expiry', 'service_due', 'policy_renewal'].includes(n.type)
          ? n.type
          : 'warranty_expiry') as NotificationType,
        title: n.title,
        message: n.message,
        dueDate: createdAtDate.toISOString(),
        daysRemaining,
        isRead: n.isRead,
        priority,
        createdAt: n.createdAt.toISOString(),
      };
    });
  }

  /**
   * Count unread notifications
   */
  static async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const existing = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!existing) return false;

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true, readAt: new Date() },
    });

    return true;
  }

  /**
   * Mark all notifications as read for user
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return result.count;
  }
}
