import { NextRequest, NextResponse } from 'next/server';
import { EmiRepository } from '@/server/repositories/emi.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse } from '@/types/api.types';
import { IEmiReminder } from '@/types/emi.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<IApiResponse<IEmiReminder | null>>> {
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
    const updated = await EmiRepository.togglePaidCurrentMonth(id, user.id);

    if (!updated) {
      return NextResponse.json(
        { success: false, data: null, error: 'EMI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: updated.isPaidThisMonth
        ? 'EMI marked as paid for this month!'
        : 'EMI marked as unpaid',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update payment status';
    return NextResponse.json(
      { success: false, data: null, error: errorMsg },
      { status: 500 }
    );
  }
}
