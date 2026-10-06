import { prisma } from '@/lib/prisma';
import { IUserProfile, UserRole, AuthProvider } from '@/types/auth.types';
import { User as PrismaUser } from '@prisma/client';

export class AuthRepository {
  /**
   * Format database User entity to client-safe IUserProfile
   */
  static formatUserProfile(user: PrismaUser): IUserProfile {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: (user.role as UserRole) || 'user',
      authProvider: (user.authProvider as AuthProvider) || 'credentials',
      avatarUrl: user.avatarUrl,
      emailVerified: Boolean(user.emailVerified),
      isProfileComplete: user.isProfileComplete,
      notificationEmailEnabled: user.notificationEmailEnabled,
      notificationInAppEnabled: user.notificationInAppEnabled,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  /**
   * Find a user by normalized email address
   */
  static async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  }

  /**
   * Find a user by ID
   */
  static async findById(id: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user record
   */
  static async createUser(data: {
    email: string;
    fullName: string;
    passwordHash?: string;
    phone?: string;
    authProvider?: AuthProvider;
    avatarUrl?: string;
    emailVerified?: boolean;
  }): Promise<IUserProfile> {
    const created = await prisma.user.create({
      data: {
        email: data.email.trim().toLowerCase(),
        fullName: data.fullName.trim(),
        passwordHash: data.passwordHash,
        phone: data.phone?.trim() || null,
        authProvider: data.authProvider || 'credentials',
        avatarUrl: data.avatarUrl || null,
        emailVerified: data.emailVerified ?? false,
        isProfileComplete: true,
        notificationEmailEnabled: true,
        notificationInAppEnabled: true,
      },
    });

    return this.formatUserProfile(created);
  }

  /**
   * Update password hash for user
   */
  static async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /**
   * Update user profile information
   */
  static async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      phone?: string;
      notificationEmailEnabled?: boolean;
      notificationInAppEnabled?: boolean;
      avatarUrl?: string;
    }
  ): Promise<IUserProfile> {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName !== undefined ? { fullName: data.fullName.trim() } : {}),
        ...(data.phone !== undefined ? { phone: data.phone.trim() || null } : {}),
        ...(data.notificationEmailEnabled !== undefined
          ? { notificationEmailEnabled: data.notificationEmailEnabled }
          : {}),
        ...(data.notificationInAppEnabled !== undefined
          ? { notificationInAppEnabled: data.notificationInAppEnabled }
          : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
      },
    });

    return this.formatUserProfile(updated);
  }

  /**
   * Store a new OTP code in database with expiration
   */
  static async createOtp(
    email: string,
    code: string,
    purpose: string,
    expiresInMinutes: number = 10
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    // Invalidate previous unused codes for this email and purpose
    await prisma.otpCode.updateMany({
      where: {
        email: email.trim().toLowerCase(),
        purpose,
        used: false,
      },
      data: { used: true },
    });

    // Create new active OTP
    await prisma.otpCode.create({
      data: {
        email: email.trim().toLowerCase(),
        code,
        purpose,
        expiresAt,
        used: false,
      },
    });
  }

  /**
   * Validate an OTP code
   */
  static async findValidOtp(
    email: string,
    code: string,
    purpose: string
  ): Promise<{ id: string } | null> {
    const record = await prisma.otpCode.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        code: code.trim(),
        purpose,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) return null;
    return { id: record.id };
  }

  /**
   * Mark OTP code as used
   */
  static async markOtpUsed(id: string): Promise<void> {
    await prisma.otpCode.update({
      where: { id },
      data: { used: true },
    });
  }
}
