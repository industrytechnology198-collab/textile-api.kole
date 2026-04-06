import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateMePasswordDto } from '../dto/update-me-password.dto';

export function ApiUpdateMePassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Change own password (Customer only)' }),
    ApiBody({ type: UpdateMePasswordDto }),
    ApiOkResponse({ description: 'Password updated successfully.', schema: { example: { message: 'Password updated successfully' } } }),
    ApiBadRequestResponse({ description: 'Current password incorrect.' }),
  );
}
