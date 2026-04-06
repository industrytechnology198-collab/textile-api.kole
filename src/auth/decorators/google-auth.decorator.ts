import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GoogleAuthDto } from '../dto/google-auth.dto';

export function ApiGoogleAuth() {
  return applyDecorators(
    ApiOperation({ summary: 'Authenticate with Google ID token' }),
    ApiBody({ type: GoogleAuthDto }),
    ApiCreatedResponse({ description: 'Returns access token and user info' }),
    ApiUnauthorizedResponse({ description: 'Invalid Google token' }),
    ApiConflictResponse({
      description:
        'An account with this email already exists. Please login with your password',
    }),
  );
}
