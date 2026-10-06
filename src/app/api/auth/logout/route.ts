import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/server/auth/auth.utils';
import { IAuthApiResponse } from '@/types/auth.types';

export const dynamic = 'force-dynamic';

export async function POST(): Promise<NextResponse<IAuthApiResponse>> {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  clearSessionCookie(response);
  return response;
}
