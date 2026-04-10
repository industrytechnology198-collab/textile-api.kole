import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Request a password reset link' }),
    ApiBody({ type: ForgotPasswordDto }),
    ApiOkResponse({
      description: 'Safe response regardless of email existence',
      schema: {
        example: {
          message: 'If this email exists you will receive a reset link',
        },
      },
    }),
  );
}
