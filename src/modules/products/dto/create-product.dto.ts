import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/enums/category.enum';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsEnum(Category)
  category: Category;

  @Type(() => Blob)
  image: Blob;
}
