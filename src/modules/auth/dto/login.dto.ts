import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Veuillez fournir une adresse email correcte' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  password: string;
}
