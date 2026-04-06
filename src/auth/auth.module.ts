import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repositories/auth.repository';
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
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { EmailService } from './services/email.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    EmailService,
    RegisterHandler,
    VerifyEmailHandler,
    LoginHandler,
    RefreshHandler,
    LogoutHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
    ResendVerificationHandler,
    ChangePasswordHandler,
    GoogleAuthHandler,
  ],
  exports: [JwtAuthGuard, RolesGuard, JwtModule, AuthRepository, EmailService],
})
export class AuthModule {}
