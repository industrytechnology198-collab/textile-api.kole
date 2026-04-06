import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ChangePasswordDto } from '../dto/change-password.dto';

export function ApiChangePassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Change password (logged-in user, provides old + new password)' }),
    ApiBody({ type: ChangePasswordDto }),
    ApiOkResponse({
      description: 'Password changed successfully',
      schema: { example: { message: 'Password changed successfully' } },
    }),
    ApiBadRequestResponse({ description: 'Old password is incorrect or new password is the same' }),
    ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' }),
  );
}
