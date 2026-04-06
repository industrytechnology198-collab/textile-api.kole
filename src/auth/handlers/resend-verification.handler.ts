import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { EmailService } from '../services/email.service';
import { ResendVerificationDto } from '../dto/resend-verification.dto';

const SAFE_RESPONSE = {
  message: 'If this email exists and is unverified you will receive a new code',
};

@Injectable()
export class ResendVerificationHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(dto: ResendVerificationDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user || user.isEmailVerified) {
      return SAFE_RESPONSE;
    }

    await this.authRepository.invalidatePreviousVerificationCodes(user.id);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.authRepository.createEmailVerification(user.id, code, expiresAt);
    await this.emailService.sendVerificationEmail(user.email, code);

    return SAFE_RESPONSE;
  }
}
