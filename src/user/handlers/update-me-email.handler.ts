import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { EmailService } from 'src/auth/services/email.service';
import { UpdateMeEmailDto } from '../dto/update-me-email.dto';

@Injectable()
export class UpdateMeEmailHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(
    userId: string,
    dto: UpdateMeEmailDto,
    res: Response,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.provider === 'google') {
      throw new BadRequestException('Google accounts cannot change email here');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password!);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    const existing = await this.userRepository.findByEmail(dto.newEmail);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    await this.userRepository.updateEmail(userId, dto.newEmail);
    await this.authRepository.revokeAllUserRefreshTokens(userId);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.authRepository.createEmailVerification(userId, code, expiresAt);
    await this.emailService.sendVerificationEmail(dto.newEmail, code, user.preferredLanguage ?? 'nl');

    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });

    return { message: 'Email updated. Please verify your new email.' };
  }
}
