import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateMeEmailDto } from '../dto/update-me-email.dto';

export function ApiUpdateMeEmail() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Change own email (Customer only)' }),
    ApiBody({ type: UpdateMeEmailDto }),
    ApiOkResponse({ description: 'Email updated. Verification email sent.', schema: { example: { message: 'Email updated. Please verify your new email.' } } }),
    ApiBadRequestResponse({ description: 'Password incorrect.' }),
    ApiConflictResponse({ description: 'Email already in use.' }),
  );
}
