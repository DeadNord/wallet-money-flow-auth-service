// NestJS and other libraries imports
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  UseGuards,
  ExecutionContext,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

// Local imports from the application
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto, ResUserDto } from './dto';
import { AuthGuard } from './middlewares/auth.guard'; // Importing custom AuthGuard
import { saveTokenCookies, clearTokenCookies } from '../helpers/cookiesHelper'; // Utility functions for cookie management

// Custom parameter decorator for extracting user information from the request
const User = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user; // Attach user data from request for use in controller methods
});

@ApiTags('auth') // Swagger tag for grouping endpoints related to authentication
@Controller('auth') // Controller prefix for all routes defined in this controller
export class AuthController {
  constructor(private readonly authService: AuthService) {} // Injecting AuthService

  @Post('signIn') // Endpoint for user sign-in
  @ApiOperation({ summary: 'Sign in user' }) // Swagger operation summary
  async signIn(
    @Body() signInAuthDto: SignInAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Use AuthService to perform sign-in logic and retrieve tokens
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInAuthDto);
    // Save refreshToken as a cookie and return accessToken as a response
    await saveTokenCookies(response, 'refreshToken', refreshToken, 1440);
    return { accessToken };
  }

  @Post('signUp') // Endpoint for user registration
  @ApiOperation({ summary: 'Sign up user' }) // Swagger operation summary
  @HttpCode(HttpStatus.CREATED) // Setting the HTTP status code to 201 for resource creation
  async signUp(@Body() signUpAuthDto: SignUpAuthDto) {
    // Use AuthService to perform sign-up logic
    await this.authService.signUp(signUpAuthDto);
  }

  @Post('signOut') // Endpoint for user sign-out
  @ApiOperation({ summary: 'Sign out user' }) // Swagger operation summary
  @HttpCode(HttpStatus.NO_CONTENT) // Setting the HTTP status code to 204 for successful request with no content to return
  async signOut(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Extract refreshToken from signed cookies and perform sign-out logic
    const { refreshToken } = request.signedCookies;
    await this.authService.signOut(refreshToken);
    // Clear refreshToken cookie
    await clearTokenCookies(response, 'refreshToken');
  }

  @Get('refresh') // Endpoint for access token refresh
  @ApiOperation({ summary: 'Refresh access token' }) // Swagger operation summary
  async refreshAccess(@Req() request: Request) {
    // Extract refreshToken from signed cookies and perform token refresh logic
    const { refreshToken } = request.signedCookies;
    const { accessToken } = await this.authService.refreshAccess(refreshToken);
    return { accessToken };
  }

  @Get('user') // Endpoint for retrieving current user information
  @ApiOperation({ summary: 'Get current user info' }) // Swagger operation summary
  @ApiBearerAuth('access-token') // Signifies this route is protected by bearer token authentication
  @UseGuards(AuthGuard) // Apply custom AuthGuard to protect the route
  async getUser(@User() user: ResUserDto) {
    // Return relevant user information
    return { name: user.name, email: user.email, mobile: user.mobile };
  }

  @Get('access') // Additional endpoint related to user access - can be customized or removed depending on use case
  @ApiOperation({ summary: 'Get current user access information' }) // Swagger operation summary
  @ApiBearerAuth('access-token') // Signifies this route is protected by bearer token authentication
  @UseGuards(AuthGuard) // Apply custom AuthGuard to protect the route
  async getAccess(@User() user: ResUserDto) {
    // Return user's id as access information
    return { id: user.id };
  }
}
