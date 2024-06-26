import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  readonly firstname: string;

  @IsString()
  @MinLength(3)
  readonly lastname: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8)
  readonly password: string;
}
