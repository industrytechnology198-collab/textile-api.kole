import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserRequestDto } from '../dto/create-user.dto';

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiBody({ type: CreateUserRequestDto }),
    ApiCreatedResponse({
      description: 'The user has been successfully created.',
    }),
  );
}
