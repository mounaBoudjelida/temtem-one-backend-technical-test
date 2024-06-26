import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';


export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly firstname: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly lastname: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
