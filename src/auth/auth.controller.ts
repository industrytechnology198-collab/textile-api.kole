import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ApiRegister } from './decorators/register.decorator';
import { ApiLogin } from './decorators/login.decorator';
import { ApiVerifyEmail } from './decorators/verify-email.decorator';
import { ApiRefresh } from './decorators/refresh.decorator';
import { ApiLogout } from './decorators/logout.decorator';
import { ApiForgotPassword } from './decorators/forgot-password.decorator';
import { ApiResetPassword } from './decorators/reset-password.decorator';
import { ApiResendVerification } from './decorators/resend-verification.decorator';
import { ApiChangePassword } from './decorators/change-password.decorator';
import { ApiGoogleAuth } from './decorators/google-auth.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiRegister()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @Public()
  @ApiVerifyEmail()
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('login')
  @Public()
  @ApiLogin()
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Post('refresh')
  @Public()
  @ApiRefresh()
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiLogout()
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }

  @Post('forgot-password')
  @Public()
  @ApiForgotPassword()
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @Public()
  @ApiResetPassword()
  resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resetPassword(dto, res);
  }

  @Post('resend-verification')
  @Public()
  @ApiResendVerification()
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiChangePassword()
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as JwtPayload;
    return this.authService.changePassword(user.userId, dto);
  }

  @Post('google')
  @Public()
  @ApiGoogleAuth()
  googleAuth(
    @Body() dto: GoogleAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleAuth(dto, res);
  }
}
