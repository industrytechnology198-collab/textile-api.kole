import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsBoolean()
  @IsNotEmpty()
  testMode!: boolean;
}
