import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/enums/category.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsEnum(Category)
  category: Category;

  @ApiProperty()
  @Type(() => Blob)
  image: Blob;
}
