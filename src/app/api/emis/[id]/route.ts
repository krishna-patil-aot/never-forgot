import { NextRequest, NextResponse } from 'next/server';
import { EmiRepository } from '@/server/repositories/emi.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse } from '@/types/api.types';
import { IEmiReminder, IUpdateEmiDto } from '@/types/emi.types';

export const dynamic = 'force-dynamic';

export async function GET(
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
    const emi = await EmiRepository.findById(id, user.id);

    if (!emi) {
      return NextResponse.json(
        { success: false, data: null, error: 'EMI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: emi,
      message: 'EMI retrieved successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch EMI';
    return NextResponse.json(
      { success: false, data: null, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body: IUpdateEmiDto = (await request.json()) as IUpdateEmiDto;
    const updated = await EmiRepository.update(id, body, user.id);

    if (!updated) {
      return NextResponse.json(
        { success: false, data: null, error: 'EMI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'EMI updated successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update EMI';
    return NextResponse.json(
      { success: false, data: null, error: errorMsg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<IApiResponse<boolean>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, data: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const deleted = await EmiRepository.delete(id, user.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, data: false, error: 'EMI not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: true,
      message: 'EMI deleted successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to delete EMI';
    return NextResponse.json(
      { success: false, data: false, error: errorMsg },
      { status: 500 }
    );
  }
}
