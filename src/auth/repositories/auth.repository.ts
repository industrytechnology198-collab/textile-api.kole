import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Email Verification ─────────────────────────────────────────────────────

  async createEmailVerification(userId: string, code: string, expiresAt: Date) {
    return this.prisma.emailVerification.create({
      data: { userId, code, expiresAt },
    });
  }

  async findActiveEmailVerification(userId: string, code: string) {
    return this.prisma.emailVerification.findFirst({
      where: {
        userId,
        code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markEmailVerificationUsed(id: string) {
    return this.prisma.emailVerification.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async invalidatePreviousVerificationCodes(userId: string) {
    return this.prisma.emailVerification.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });
  }

  // ─── Refresh Tokens ──────────────────────────────────────────────────────────

  async createRefreshToken(
    userId: string,
    hashedToken: string,
    expiresAt: Date,
  ) {
    return this.prisma.refreshToken.create({
      data: { userId, token: hashedToken, expiresAt },
    });
  }

  async findActiveRefreshToken(hashedToken: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async revokeRefreshToken(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllUserRefreshTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ─── Password Reset ──────────────────────────────────────────────────────────

  async createPasswordReset(
    userId: string,
    hashedToken: string,
    expiresAt: Date,
  ) {
    return this.prisma.passwordReset.create({
      data: { userId, token: hashedToken, expiresAt },
    });
  }

  async findActivePasswordReset(hashedToken: string) {
    return this.prisma.passwordReset.findFirst({
      where: {
        token: hashedToken,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markPasswordResetUsed(id: string) {
    return this.prisma.passwordReset.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}
