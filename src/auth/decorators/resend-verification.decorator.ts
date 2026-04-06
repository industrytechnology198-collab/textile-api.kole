import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResendVerificationDto } from '../dto/resend-verification.dto';

export function ApiResendVerification() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend email verification code' }),
    ApiBody({ type: ResendVerificationDto }),
    ApiOkResponse({ description: 'Safe response regardless of email state', schema: { example: { message: 'If this email exists and is unverified you will receive a new code' } } }),
  );
}
