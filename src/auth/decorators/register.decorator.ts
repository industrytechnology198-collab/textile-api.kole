import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new customer account' }),
    ApiBody({ type: RegisterDto }),
    ApiCreatedResponse({
      description: 'Verification email sent',
      schema: { example: { message: 'Verification email sent' } },
    }),
    ApiConflictResponse({ description: 'Email already in use' }),
  );
}
