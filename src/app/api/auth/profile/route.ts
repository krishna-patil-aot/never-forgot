import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/server/auth/session';
import { AuthRepository } from '@/server/repositories/auth.repository';
import { IUpdateProfileDto, IAuthApiResponse } from '@/types/auth.types';
import { isValidGlobalPhoneNumber, normalizeGlobalPhoneNumber } from '@/lib/phoneValidation';

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

    // Validate full name if provided
    if (body.fullName !== undefined) {
      const trimmedName = body.fullName.trim();
      if (trimmedName.length < 2) {
        return NextResponse.json(
          {
            success: false,
            message: 'Full name must be at least 2 characters long.',
          },
          { status: 400 }
        );
      }
    }

    // Validate phone number against global standard (ITU-T E.164)
    let sanitizedPhone: string | undefined = undefined;
    if (body.phone !== undefined && body.phone !== null) {
      const trimmedPhone = body.phone.trim();
      if (trimmedPhone !== '') {
        if (!isValidGlobalPhoneNumber(trimmedPhone)) {
          return NextResponse.json(
            {
              success: false,
              message:
                'Invalid phone number. Please enter a valid global standard phone number with country code (e.g. +1 555 123 4567 or +91 98765 43210).',
            },
            { status: 400 }
          );
        }
        sanitizedPhone = normalizeGlobalPhoneNumber(trimmedPhone);
      } else {
        // Explicitly clearing phone number
        sanitizedPhone = '';
      }
    }

    const updatedUser = await AuthRepository.updateProfile(currentUser.id, {
      fullName: body.fullName,
      phone: sanitizedPhone,
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
