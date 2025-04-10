import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { IsPublic } from '../common/decorators/is-public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @ApiOperation({ summary: 'Login and receive a JWT token' })
  @ApiBody({
    schema: {
      example: {
        email: 'john@example.com',
        password: 'secretPassword',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access_token.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or bad request.',
  })
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @IsPublic()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secretPassword',
        birth_date: '1990-01-01T00:00:00.000Z',
        weight: 70,
        height: 1.75,
        role: 'USER',
        avatar_url: 'http://example.com/avatar.png',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered. Returns access_token.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or bad request.',
  })
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }
}
