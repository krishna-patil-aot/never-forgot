import { NextRequest, NextResponse } from 'next/server';
import { AssetRepository } from '@/server/repositories/asset.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IApiResponse, IUpdateAssetDto } from '@/types/api.types';
import { IUniversalAsset } from '@/types/asset.types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<IApiResponse<IUniversalAsset | null>>> {
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
    const asset = await AssetRepository.findById(id, user.id);

    if (!asset) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Asset not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: asset,
      message: 'Asset retrieved successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching asset';
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<IApiResponse<IUniversalAsset | null>>> {
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
    const body: IUpdateAssetDto = (await request.json()) as IUpdateAssetDto;

    const updated = await AssetRepository.update(id, body, user.id);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Asset not found or unauthorized to update',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Asset updated successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating asset';
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
    const deleted = await AssetRepository.delete(id, user.id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          data: false,
          error: 'Asset not found or unauthorized to delete',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: true,
      message: 'Asset deleted successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Error deleting asset';
    return NextResponse.json(
      {
        success: false,
        data: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
