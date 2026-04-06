import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { Role } from '@prisma/client';
import * as crypto from 'crypto';
import { Response } from 'express';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { GoogleAuthDto } from '../dto/google-auth.dto';

@Injectable()
export class GoogleAuthHandler {
  private readonly oauthClient: OAuth2Client;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.oauthClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async execute(dto: GoogleAuthDto, res: Response) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    let googlePayload: {
      sub: string;
      email: string;
      given_name?: string;
      family_name?: string;
    };

    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: dto.idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Empty payload');
      }
      googlePayload = payload as typeof googlePayload;
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }

    const { sub: googleId, email, given_name, family_name } = googlePayload;
    const firstName = given_name ?? '';
    const lastName = family_name ?? '';

    let user = await this.userRepository.findByGoogleId(googleId);

    if (!user) {
      const existingByEmail = await this.userRepository.findByEmail(email);

      if (existingByEmail && existingByEmail.provider === 'local') {
        throw new ConflictException(
          'An account with this email already exists. Please login with your password',
        );
      }

      user = await this.userRepository.create({
        email,
        password: null,
        firstName,
        lastName,
        googleId,
        provider: 'google',
        isEmailVerified: true,
        role: Role.CUSTOMER,
      });
    }

    const accessToken = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const rawRefreshToken = crypto.randomUUID();
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(rawRefreshToken)
      .digest('hex');

    const expiresStr = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
      '30d',
    );
    const expiresMs = this.parseDuration(expiresStr);
    const expiresAt = new Date(Date.now() + expiresMs);

    await this.authRepository.createRefreshToken(
      user.id,
      hashedRefreshToken,
      expiresAt,
    );

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('refresh_token', rawRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      expires: expiresAt,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
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
