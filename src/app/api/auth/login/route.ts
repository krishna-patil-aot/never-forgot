import { NextRequest, NextResponse } from 'next/server';
import { AuthRepository } from '@/server/repositories/auth.repository';
import {
  verifyPassword,
  signSessionToken,
  attachSessionCookie,
} from '@/server/auth/auth.utils';
import { ILoginCredentialsDto, IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const body = (await request.json()) as ILoginCredentialsDto;

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const user = await AuthRepository.findByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'No account found with this email. Please sign up first.',
        },
        { status: 404 }
      );
    }

    if (!body.password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message:
            'This account uses OTP or Google sign-in. Please use OTP or Google to log in.',
        },
        { status: 400 }
      );
    }

    const isMatch = verifyPassword(body.password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Try again or reset password.' },
        { status: 401 }
      );
    }

    const userProfile = AuthRepository.formatUserProfile(user);
    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: userProfile.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: userProfile,
    });

    attachSessionCookie(response, token);
    return response;
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Login failed unexpectedly';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
