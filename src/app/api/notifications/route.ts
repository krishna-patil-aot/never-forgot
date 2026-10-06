import { NextRequest, NextResponse } from 'next/server';
import { NotificationRepository } from '@/server/repositories/notification.repository';
import { NotificationService } from '@/server/services/notification.service';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse } from '@/types/api.types';
import { INotification } from '@/types/notification.types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest
): Promise<NextResponse<IApiResponse<INotification[]>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No notifications for unauthenticated guest',
      });
    }

    // Proactively evaluate countdowns and trigger new alerts for authenticated user
    await NotificationService.checkAndGenerateAlerts(user.id);

    // Fetch fresh notification list
    const notifications = await NotificationRepository.findMany(user.id);

    return NextResponse.json({
      success: true,
      data: notifications,
      message: 'Live notifications retrieved successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve notifications';
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
