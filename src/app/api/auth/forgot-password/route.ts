import { NextRequest, NextResponse } from 'next/server';
import { AuthRepository } from '@/server/repositories/auth.repository';
import { generateNumericOtp } from '@/server/auth/auth.utils';
import { IForgotPasswordDto, IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const body = (await request.json()) as IForgotPasswordDto;

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Registered email address is required' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const user = await AuthRepository.findByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'No account found with this email address.',
        },
        { status: 404 }
      );
    }

    const otpCode = generateNumericOtp();
    await AuthRepository.createOtp(email, otpCode, 'reset_password', 15);

    console.log(
      `[NeverForgot Auth] 🔐 Password Reset OTP for ${email}: [ ${otpCode} ] (Valid for 15 minutes)`
    );

    return NextResponse.json({
      success: true,
      message: `Password reset verification OTP sent to ${email}`,
      devOtp: otpCode,
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to request password reset';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
