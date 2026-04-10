import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class RefreshHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(req: Request, res: Response): Promise<{ accessToken: string }> {
    const rawToken: string | undefined = req.cookies?.refresh_token;

    if (!rawToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const record =
      await this.authRepository.findActiveRefreshToken(hashedToken);

    if (!record) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.authRepository.revokeRefreshToken(record.id);

    const user = await this.userRepository.findById(record.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const newRawToken = crypto.randomUUID();
    const newHashedToken = crypto
      .createHash('sha256')
      .update(newRawToken)
      .digest('hex');

    const expiresStr = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
      '30d',
    );
    const expiresMs = this.parseDuration(expiresStr);
    const expiresAt = new Date(Date.now() + expiresMs);

    await this.authRepository.createRefreshToken(
      user.id,
      newHashedToken,
      expiresAt,
    );

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('refresh_token', newRawToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      expires: expiresAt,
    });

    return { accessToken };
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * multipliers[unit];
  }
}
