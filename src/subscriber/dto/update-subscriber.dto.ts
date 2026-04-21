import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class UpdateSubscriberDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

