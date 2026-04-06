import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AuthRepository } from 'src/auth/repositories/auth.repository';
import { UpdateMePasswordDto } from '../dto/update-me-password.dto';

@Injectable()
export class UpdateMePasswordHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(
    userId: string,
    dto: UpdateMePasswordDto,
    res: Response,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.provider === 'google') {
      throw new BadRequestException('Google accounts cannot change password');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password!,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
    await this.authRepository.revokeAllUserRefreshTokens(userId);

    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });

    return { message: 'Password updated successfully' };
  }
}
