import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsEmail,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) definition for creating a new user during the authentication process.
 * Includes validation rules to ensure data integrity and security.
 */
class SignUpAuthDto {
  @ApiProperty({
    description: "User's email address",
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    description: "User's full name",
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name should not be empty.' })
  @IsString({ message: 'Name must be a string.' })
  @MinLength(2, { message: 'Name must be at least 2 characters long.' })
  name: string;

  @ApiProperty({
    description: "User's mobile phone number",
    example: '+1234567890',
  })
  @IsNotEmpty({ message: 'Mobile should not be empty.' })
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Mobile must be a valid international mobile phone number.',
  })
  mobile: string;

  @ApiProperty({
    description: "User's password for authentication",
    example: 'SecurePassword123!',
    minLength: 8, // Defines the minimum length in the Swagger UI
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must include uppercase, lowercase letters, a number, and a special character.',
  })
  password: string;
}

export { SignUpAuthDto };
