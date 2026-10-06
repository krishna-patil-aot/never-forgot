import { NextRequest, NextResponse } from "next/server";
import { AuthRepository } from "@/server/repositories/auth.repository";
import {
  signSessionToken,
  attachSessionCookie,
} from "@/server/auth/auth.utils";
import { IVerifyOtpDto, IAuthApiResponse } from "@/types/auth.types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const body = (await request.json()) as IVerifyOtpDto;

    if (!body.email || !body.code) {
      return NextResponse.json(
        { success: false, message: "Email and OTP code are required" },
        { status: 400 },
      );
    }

    const email = body.email.trim().toLowerCase();
    const code = body.code.trim();
    const purpose = body.purpose || "login";

    const validRecord = await AuthRepository.findValidOtp(email, code, purpose);
    if (!validRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired 6-digit code. Please request a new one.",
        },
        { status: 400 },
      );
    }

    // Mark OTP as used
    await AuthRepository.markOtpUsed(validRecord.id);

    // If purpose is reset_password, this endpoint only validates; reset-password route completes the flow
    if (purpose === "reset_password") {
      return NextResponse.json({
        success: true,
        message: "OTP verified successfully. You can now reset your password.",
      });
    }

    // For login or register: find or create user
    const user = await AuthRepository.findByEmail(email);

    if (!user) {
      // Auto-register via verified OTP
      const userProfile = await AuthRepository.createUser({
        email,
        fullName: body.fullName?.trim() || email.split("@")[0],
        authProvider: "otp",
        emailVerified: true,
      });

      const token = signSessionToken({
        userId: userProfile.id,
        email: userProfile.email,
        role: userProfile.role,
      });

      const response = NextResponse.json(
        {
          success: true,
          message: "Account verified and logged in successfully",
          user: userProfile,
        },
        { status: 201 },
      );

      attachSessionCookie(response, token);
      return response;
    }

    const userProfile = AuthRepository.formatUserProfile(user);
    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: userProfile.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in with OTP successfully",
      user: userProfile,
    });

    attachSessionCookie(response, token);
    return response;
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "OTP verification failed";
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 },
    );
  }
}
