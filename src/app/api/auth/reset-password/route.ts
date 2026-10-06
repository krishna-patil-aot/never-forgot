import { NextRequest, NextResponse } from 'next/server';
import { AuthRepository } from '@/server/repositories/auth.repository';
import { hashPassword } from '@/server/auth/auth.utils';
import { IResetPasswordDto, IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const body = (await request.json()) as IResetPasswordDto;

    if (!body.email || !body.code || !body.newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, OTP code, and new password are required' },
        { status: 400 }
      );
    }

    if (body.newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const validOtp = await AuthRepository.findValidOtp(
      email,
      body.code,
      'reset_password'
    );

    if (!validOtp) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP code for password reset' },
        { status: 400 }
      );
    }

    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password and update in DB
    const newPasswordHash = hashPassword(body.newPassword);
    await AuthRepository.updatePassword(user.id, newPasswordHash);

    // Invalidate OTP
    await AuthRepository.markOtpUsed(validOtp.id);

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully updated! You can now log in.',
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Password reset failed';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
