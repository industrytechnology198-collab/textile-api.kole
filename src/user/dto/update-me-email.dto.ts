import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMeEmailDto {
  @ApiProperty({ example: 'newemail@example.com' })
  @IsEmail()
  @IsNotEmpty()
  newEmail!: string;

  @ApiProperty({ example: 'myPassword123' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
