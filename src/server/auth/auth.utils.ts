import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@/types/auth.types';

export const AUTH_COOKIE_NAME = 'neverforgot_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'neverforgot-super-secret-jwt-key-2026';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface ISessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

/**
 * Hash a plain password using cryptographic scrypt with a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify a plain password against the stored salt:hash string
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generateNumericOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Create a tamper-proof signed session token
 */
export function signSessionToken(payload: Omit<ISessionPayload, 'exp'>): string {
  const fullPayload: ISessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const bodyBase64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(bodyBase64)
    .digest('base64url');
  return `${bodyBase64}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string): ISessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [bodyBase64, providedSignature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(bodyBase64)
      .digest('base64url');

    if (
      !crypto.timingSafeEqual(
        Buffer.from(providedSignature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    const jsonString = Buffer.from(bodyBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonString) as ISessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Attach the session cookie to an outgoing HTTP response
 */
export function attachSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });
}

/**
 * Clear session cookie on logout
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Extract session token from request cookies or Authorization header
 */
export function getSessionTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}
