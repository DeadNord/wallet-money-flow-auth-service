import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user sign-in.
 * Contains user credentials: email and password.
 */
class SignInAuthDto {
  @ApiProperty({
    type: String,
    required: true,
    description: "User's email address used for signing in.",
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: "User's password used for signing in.",
    example: 'SecurePassword123!',
    minLength: 8, // Minimum length is just for example, adjust according to your security standards
  })
  @IsNotEmpty({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' }) // Enforce minimum length for security
  password: string;
}

export { SignInAuthDto };
