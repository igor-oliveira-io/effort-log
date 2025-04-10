import {
  IsEmail,
  IsString,
  IsDateString,
  MinLength,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class RegisterAuthDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsDateString()
  birth_date: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  avatar_url?: string;
}
