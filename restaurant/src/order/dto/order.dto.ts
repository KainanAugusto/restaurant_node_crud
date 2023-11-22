// create-order.dto.ts
import { IsNotEmpty, IsNumber, IsArray, ValidateNested, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  menuId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}