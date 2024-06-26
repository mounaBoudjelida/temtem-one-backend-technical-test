import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';
import { NodeEnv } from 'src/enums/environments.enum';


class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: string = NodeEnv.DEV;

  @IsString()
  @MinLength(64)
  JWT_SECRET: string;

  @IsString()
  DB_URI: string;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsEmail()
  ADMIN_EMAIL: string;

  @IsEmail()
  MAIL_ACCOUNT: string;

  @IsString()
  MAIL_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
