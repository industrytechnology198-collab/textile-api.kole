import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Injectable()
export class VerifyEmailHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(dto: VerifyEmailDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const record = await this.authRepository.findActiveEmailVerification(
      user.id,
      dto.code,
    );

    if (!record) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.authRepository.markEmailVerificationUsed(record.id);
    await this.userRepository.updateEmailVerified(user.id, true);

    return { message: 'Email verified successfully' };
  }
}
