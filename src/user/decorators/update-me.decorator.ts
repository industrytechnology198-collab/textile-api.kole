import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateMeDto } from '../dto/update-me.dto';

export function ApiUpdateMe() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update own profile (firstName, lastName, phoneNumber)',
    }),
    ApiBody({ type: UpdateMeDto }),
    ApiOkResponse({ description: 'Profile updated successfully.' }),
  );
}
