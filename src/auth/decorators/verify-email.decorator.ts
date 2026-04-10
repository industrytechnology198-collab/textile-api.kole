import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { VerifyEmailDto } from '../dto/verify-email.dto';

export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify email with 6-digit code' }),
    ApiBody({ type: VerifyEmailDto }),
    ApiOkResponse({
      description: 'Email verified successfully',
      schema: { example: { message: 'Email verified successfully' } },
    }),
    ApiBadRequestResponse({ description: 'Invalid or expired code' }),
  );
}
