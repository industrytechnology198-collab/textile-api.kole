import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Role } from '@prisma/client';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { EmailService } from '../services/email.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

const SAFE_RESPONSE = {
  message: 'If this email exists you will receive a reset link',
};

@Injectable()
export class ForgotPasswordHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user || user.provider !== 'local' || user.role === Role.ADMIN) {
      return SAFE_RESPONSE;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.authRepository.createPasswordReset(
      user.id,
      hashedToken,
      expiresAt,
    );
    await this.emailService.sendPasswordResetEmail(user.email, rawToken);

    return SAFE_RESPONSE;
  }
}
