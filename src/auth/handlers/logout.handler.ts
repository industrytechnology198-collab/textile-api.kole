import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class LogoutHandler {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(req: Request, res: Response): Promise<{ message: string }> {
    const rawToken: string | undefined = req.cookies?.refresh_token;

    if (rawToken) {
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const record = await this.authRepository.findActiveRefreshToken(hashedToken);

      if (record) {
        await this.authRepository.revokeRefreshToken(record.id);
      }
    }

    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });

    return { message: 'Logged out successfully' };
  }
}
