import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SetReviewVisibilityDto {
  @IsBoolean()
  @IsNotEmpty()
  isVisible!: boolean;
}
