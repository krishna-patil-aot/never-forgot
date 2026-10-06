import { NextRequest, NextResponse } from 'next/server';
import { NotificationRepository } from '@/server/repositories/notification.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse } from '@/types/api.types';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<IApiResponse<{ id: string } | null>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const success = await NotificationRepository.markAsRead(id, user.id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Notification not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Notification marked as read',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update notification';
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
