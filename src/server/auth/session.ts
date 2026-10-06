import { NextRequest } from 'next/server';
import { getSessionTokenFromRequest, verifySessionToken } from './auth.utils';
import { AuthRepository } from '../repositories/auth.repository';
import { IUserProfile } from '@/types/auth.types';

/**
 * Retrieve the current authenticated user from request cookies or Authorization header.
 * Returns null if unauthenticated or token is expired/invalid.
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<IUserProfile | null> {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const user = await AuthRepository.findById(payload.userId);
  if (!user) return null;

  return AuthRepository.formatUserProfile(user);
}
