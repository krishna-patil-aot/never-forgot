import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/server/auth/session';
import { IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthenticated', user: undefined },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Authenticated session retrieved',
      user,
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to retrieve session';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
