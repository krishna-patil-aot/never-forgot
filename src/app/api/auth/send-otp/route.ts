import { NextRequest, NextResponse } from 'next/server';
import { AuthRepository } from '@/server/repositories/auth.repository';
import { generateNumericOtp } from '@/server/auth/auth.utils';
import { ISendOtpDto, IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const body = (await request.json()) as ISendOtpDto;

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const purpose = body.purpose || 'login';

    // For forgot_password / reset_password: check user existence
    if (purpose === 'reset_password') {
      const existingUser = await AuthRepository.findByEmail(email);
      if (!existingUser) {
        return NextResponse.json(
          {
            success: false,
            message: 'No account registered with this email address.',
          },
          { status: 404 }
        );
      }
    }

    // Generate 6-digit cryptographic OTP
    const otpCode = generateNumericOtp();

    // Persist OTP in database with 10 minute expiration
    await AuthRepository.createOtp(email, otpCode, purpose, 10);

    console.log(
      `[NeverForgot Auth] 🔑 6-Digit OTP for ${email} (${purpose}): [ ${otpCode} ] (Valid for 10 minutes)`
    );

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been generated for ${email}.`,
      devOtp: otpCode, // Provided for instant local developer testing & demo experience
    });
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Failed to send OTP code';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
