import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/server/auth/session';
import { AuthRepository } from '@/server/repositories/auth.repository';
import { IUpdateProfileDto, IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const currentUser = await getAuthenticatedUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as IUpdateProfileDto;

    const updatedUser = await AuthRepository.updateProfile(currentUser.id, {
      fullName: body.fullName,
      phone: body.phone,
      notificationEmailEnabled: body.notificationEmailEnabled,
      notificationInAppEnabled: body.notificationInAppEnabled,
      avatarUrl: body.avatarUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to update profile';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
