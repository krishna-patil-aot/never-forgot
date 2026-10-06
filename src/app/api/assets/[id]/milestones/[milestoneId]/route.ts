import { NextRequest, NextResponse } from 'next/server';
import { AssetRepository } from '@/server/repositories/asset.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse } from '@/types/api.types';
import { IServiceMilestone } from '@/types/asset.types';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; milestoneId: string }> }
): Promise<NextResponse<IApiResponse<IServiceMilestone | null>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, data: null, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, milestoneId } = await context.params;
    const milestone = await AssetRepository.toggleMilestone(id, milestoneId, user.id);

    if (!milestone) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Milestone or asset not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: milestone,
      message: 'Milestone status updated successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating milestone';
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
