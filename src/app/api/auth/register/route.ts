import { NextRequest, NextResponse } from 'next/server';
import { AuthRepository } from '@/server/repositories/auth.repository';
import {
  hashPassword,
  signSessionToken,
  attachSessionCookie,
} from '@/server/auth/auth.utils';
import { EmailService } from '@/server/services/email.service';
import { IRegisterDto, IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const body = (await request.json()) as IRegisterDto;

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!body.fullName || !body.fullName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Full name is required' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    // Check if user is already registered
    const existingUser = await AuthRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          alreadyRegistered: true,
          message:
            'An account with this email already exists. Please log in or use forgot password.',
        },
        { status: 409 }
      );
    }

    // Hash password if supplied
    const passwordHash = body.password ? hashPassword(body.password) : undefined;

    const newUser = await AuthRepository.createUser({
      email,
      fullName: body.fullName.trim(),
      passwordHash,
      phone: body.phone?.trim(),
      authProvider: 'credentials',
      emailVerified: false,
    });

    // Send welcome email to new user
    EmailService.sendWelcomeEmail(newUser.email, newUser.fullName).catch(
      (emailErr) => {
        console.error(
          `[Register] Failed to send welcome email to ${newUser.email}:`,
          emailErr
        );
      }
    );

    // Create session token & response
    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: newUser,
      },
      { status: 201 }
    );

    attachSessionCookie(response, token);
    return response;
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : 'Registration failed unexpectedly';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
