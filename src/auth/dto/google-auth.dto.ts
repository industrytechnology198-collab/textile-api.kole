import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({
    description:
      'Google ID token received from the frontend after Google sign-in',
  })
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
