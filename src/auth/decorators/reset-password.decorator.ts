import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResetPasswordDto } from '../dto/reset-password.dto';

export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset password using token from email' }),
    ApiBody({ type: ResetPasswordDto }),
    ApiOkResponse({ description: 'Password reset successfully', schema: { example: { message: 'Password reset successfully' } } }),
    ApiBadRequestResponse({ description: 'Invalid or expired token' }),
  );
}
