import { NextRequest, NextResponse } from 'next/server';
import { AssetRepository } from '@/server/repositories/asset.repository';
import { ensureDbInitialized } from '@/server/initDb';
import { getAuthenticatedUser } from '@/server/auth/session';
import {
  IApiResponse,
  IPaginatedData,
  ICreateAssetDto,
  IAssetFilterQuery,
} from '@/types/api.types';
import {
  AssetCategory,
  ExpiryStatus,
  IUniversalAsset,
  SortOption,
} from '@/types/asset.types';
import { isDateBefore } from '@/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest
): Promise<NextResponse<IApiResponse<IPaginatedData<IUniversalAsset>>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);

    // If unauthenticated guest, return empty live dataset
    if (!user) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          pagination: {
            total: 0,
            page: 1,
            pageSize: 50,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        message: 'Guest session — please sign in to view your live vault',
      });
    }

    const { searchParams } = new URL(request.url);

    const categoryParam = searchParams.get('category');
    const statusParam = searchParams.get('status');
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const sortByParam = searchParams.get('sortBy');
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');

    const filterQuery: IAssetFilterQuery = {
      category:
        categoryParam && categoryParam !== 'all'
          ? (categoryParam as AssetCategory)
          : 'all',
      status:
        statusParam && statusParam !== 'all'
          ? (statusParam as ExpiryStatus)
          : 'all',
      searchQuery: searchQuery || undefined,
      sortBy: (sortByParam as SortOption) || 'expiry_asc',
      page: pageParam ? parseInt(pageParam, 10) : 1,
      pageSize: pageSizeParam ? parseInt(pageSizeParam, 10) : 50,
    };

    const paginated = await AssetRepository.findMany(filterQuery, user.id);

    return NextResponse.json({
      success: true,
      data: paginated,
      message: 'Live assets retrieved successfully',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch assets';
    return NextResponse.json(
      {
        success: false,
        data: {
          items: [],
          pagination: {
            total: 0,
            page: 1,
            pageSize: 50,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<IApiResponse<IUniversalAsset | null>>> {
  await ensureDbInitialized();

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Please sign in to add assets to your vault.',
        },
        { status: 401 }
      );
    }

    const body: ICreateAssetDto = (await request.json()) as ICreateAssetDto;

    // Strict validation
    if (!body.title || !body.providerOrBrand || !body.category || !body.startDate || !body.expiryOrRenewalDate) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Missing required fields (title, providerOrBrand, category, startDate, expiryOrRenewalDate)',
        },
        { status: 400 }
      );
    }

    if (isDateBefore(body.expiryOrRenewalDate, body.startDate)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'Expiry or renewal date cannot be before the purchase date.',
        },
        { status: 400 }
      );
    }

    const created = await AssetRepository.create(body, user.id);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Asset registered successfully in live database',
      },
      { status: 201 }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create asset';
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
