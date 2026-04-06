import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: LoginDto, res: Response) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.provider === 'google') {
      throw new BadRequestException('Please login with Google');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password!);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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
