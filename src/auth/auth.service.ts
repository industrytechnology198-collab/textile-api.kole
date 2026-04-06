import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { RegisterHandler } from './handlers/register.handler';
import { VerifyEmailHandler } from './handlers/verify-email.handler';
import { LoginHandler } from './handlers/login.handler';
import { RefreshHandler } from './handlers/refresh.handler';
import { LogoutHandler } from './handlers/logout.handler';
import { ForgotPasswordHandler } from './handlers/forgot-password.handler';
import { ResetPasswordHandler } from './handlers/reset-password.handler';
import { ResendVerificationHandler } from './handlers/resend-verification.handler';
import { ChangePasswordHandler } from './handlers/change-password.handler';
import { GoogleAuthHandler } from './handlers/google-auth.handler';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerHandler: RegisterHandler,
    private readonly verifyEmailHandler: VerifyEmailHandler,
    private readonly loginHandler: LoginHandler,
    private readonly refreshHandler: RefreshHandler,
    private readonly logoutHandler: LogoutHandler,
    private readonly forgotPasswordHandler: ForgotPasswordHandler,
    private readonly resetPasswordHandler: ResetPasswordHandler,
    private readonly resendVerificationHandler: ResendVerificationHandler,
    private readonly changePasswordHandler: ChangePasswordHandler,
    private readonly googleAuthHandler: GoogleAuthHandler,
  ) {}

  register(dto: RegisterDto) {
    return this.registerHandler.execute(dto);
  }

  verifyEmail(dto: VerifyEmailDto) {
    return this.verifyEmailHandler.execute(dto);
  }

  login(dto: LoginDto, res: Response) {
    return this.loginHandler.execute(dto, res);
  }

  refresh(req: Request, res: Response) {
    return this.refreshHandler.execute(req, res);
  }

  logout(req: Request, res: Response) {
    return this.logoutHandler.execute(req, res);
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return this.forgotPasswordHandler.execute(dto);
  }

  resetPassword(dto: ResetPasswordDto, res: Response) {
    return this.resetPasswordHandler.execute(dto, res);
  }

  resendVerification(dto: ResendVerificationDto) {
    return this.resendVerificationHandler.execute(dto);
  }

  changePassword(userId: string, dto: ChangePasswordDto) {
    return this.changePasswordHandler.execute(userId, dto);
  }

  googleAuth(dto: GoogleAuthDto, res: Response) {
    return this.googleAuthHandler.execute(dto, res);
  }
}
