import { NextRequest, NextResponse } from 'next/server';
import { NotificationRepository } from '@/server/repositories/notification.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse } from '@/types/api.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IApiResponse<{ updatedCount: number }>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, data: { updatedCount: 0 }, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updatedCount = await NotificationRepository.markAllAsRead(user.id);

    return NextResponse.json({
      success: true,
      data: { updatedCount },
      message: `${updatedCount} notifications marked as read`,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to mark all as read';
    return NextResponse.json(
      {
        success: false,
        data: { updatedCount: 0 },
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
