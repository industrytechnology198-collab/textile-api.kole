import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ToptexDeliveryAddressDto {
  @IsString()
  @IsNotEmpty()
  addressTitle!: string;

  @IsString()
  @IsNotEmpty()
  street1!: string;

  @IsString()
  street2!: string;

  @IsString()
  @IsNotEmpty()
  postCode!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsNotEmpty()
  contactName!: string;

  @IsString()
  @IsNotEmpty()
  contactPhone!: string;

  @IsEmail()
  contactEmail!: string;
}

export class ToptexOrderLineDto {
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsInt()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  lineNumber!: string;

  @IsString()
  comment!: string;
}

export class CreateToptexOrderDto {
  @IsString()
  @IsNotEmpty()
  orderID!: string;

  @IsString()
  @IsNotEmpty()
  orderReference!: string;

  @IsString()
  @IsNotEmpty()
  orderStatus!: string;

  @IsString()
  @IsNotEmpty()
  expectedDeliveryDate!: string;

  @IsString()
  @IsNotEmpty()
  myOrderID!: string;

  @IsInt()
  orderManagement!: number;

  @IsInt()
  waitForFreeShipping!: number;

  @IsString()
  expressShipping!: string;

  @IsInt()
  neutralDeliveryNote!: number;

  @IsBoolean()
  testMode!: boolean;

  @IsString()
  comment!: string;

  @ValidateNested()
  @Type(() => ToptexDeliveryAddressDto)
  deliveryAddress!: ToptexDeliveryAddressDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToptexOrderLineDto)
  orderLines!: ToptexOrderLineDto[];
}

export interface CreateToptexOrderResponse {
  temporaryOrderId: string;
  [key: string]: unknown;
}

export type GetToptexOrderResponse = Record<string, unknown>;

export type GetToptexOrdersResponse = Record<string, unknown>;
