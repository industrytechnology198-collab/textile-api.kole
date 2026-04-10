import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class ResetPasswordHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(
    dto: ResetPasswordDto,
    res: Response,
  ): Promise<{ message: string }> {
    const hashedToken = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');
    const record =
      await this.authRepository.findActivePasswordReset(hashedToken);

    if (!record) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepository.updatePassword(record.userId, hashedPassword);
    await this.authRepository.markPasswordResetUsed(record.id);
    await this.authRepository.revokeAllUserRefreshTokens(record.userId);

    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });

    return { message: 'Password reset successfully' };
  }
}
