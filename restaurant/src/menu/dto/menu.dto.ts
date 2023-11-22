import { IsNotEmpty, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  dishName: string;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class UpdateMenuDto extends CreateMenuDto {}
