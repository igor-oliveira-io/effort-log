import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Role } from '../../common/enums/user_role.enum';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Birth date is required' })
  @Transform(({ value }) => new Date(value))
  birth_date: Date | string;

  @IsNotEmpty({ message: 'Weight is required' })
  @IsNumber()
  weight: number;

  @IsNotEmpty({ message: 'Height is required' })
  @IsNumber()
  height: number;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, {
    message: `Role must be one of: ${Object.values(Role).join(', ')}`,
  })
  role: Role;

  @IsOptional()
  @IsString()
  avatar_url?: string | null;
}
