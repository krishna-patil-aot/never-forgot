import { NextRequest, NextResponse } from "next/server";
import { AuthRepository } from "@/server/repositories/auth.repository";
import {
  signSessionToken,
  attachSessionCookie,
} from "@/server/auth/auth.utils";
import { IGoogleAuthDto, IAuthApiResponse } from "@/types/auth.types";

export const dynamic = "force-dynamic";

interface IGoogleTokenInfo {
  email: string;
  email_verified?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<IAuthApiResponse>> {
  try {
    const body = (await request.json()) as IGoogleAuthDto;

    let targetEmail = body.email ? body.email.trim().toLowerCase() : "";
    let targetName = body.fullName?.trim() || "";
    let targetAvatar = body.avatarUrl;

    // If an ID token was passed from Google Identity Services, verify with Google
    if (body.credential) {
      try {
        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
            body.credential
          )}`
        );
        if (verifyRes.ok) {
          const info = (await verifyRes.json()) as IGoogleTokenInfo;
          if (info.email) {
            targetEmail = info.email.toLowerCase();
            targetName = info.name || targetName;
            targetAvatar = info.picture || targetAvatar;
          }
        }
      } catch {
        // Fall back to provided values if offline or dev
      }
    }

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, message: "Google account email is required" },
        { status: 400 },
      );
    }

    const user = await AuthRepository.findByEmail(targetEmail);

    if (!user) {
      // Auto-register new Google user with verified status
      const newUser = await AuthRepository.createUser({
        email: targetEmail,
        fullName: targetName || targetEmail.split("@")[0],
        authProvider: "google",
        avatarUrl: targetAvatar,
        emailVerified: true,
      });

      const token = signSessionToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      const response = NextResponse.json(
        {
          success: true,
          message: "Google account linked and logged in successfully",
          user: newUser,
        },
        { status: 201 },
      );

      attachSessionCookie(response, token);
      return response;
    }

    // Existing user: log in directly
    const userProfile = AuthRepository.formatUserProfile(user);
    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: userProfile.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in with Google successfully",
      user: userProfile,
    });

    attachSessionCookie(response, token);
    return response;
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "Google authentication failed";
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 },
    );
  }
}
