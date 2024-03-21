import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response } from 'express';
import { saveTokenCookies, clearTokenCookies } from 'src/helpers/cookiesHelper';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signIn')
  @ApiOperation({ summary: 'signIn User' })
  async signIn() {
    // @Res({ passthrough: true }) response: Response, // @Body() createAuthDto: CreateAuthDto,
    // const { accessToken, refreshToken } = await this.authService.signIn(
    //   createAuthDto,
    // );
    // await saveTokenCookies(response, 'refreshToken', refreshToken, 'h');
    // return { accessToken };
  }

  @Get('refresh')
  @ApiOperation({ summary: 'refresh Access Token' })
  async refreshAccess(@Req() request: Request) {
    const { refreshToken } = request.signedCookies;
    const { accessToken } = await this.authService.refreshAccess(refreshToken);
    return { accessToken };
  }

  async signUp() {
    // @Res({ passthrough: true }) response: Response, // @Body() createAuthDto: CreateAuthDto,
    // const { accessToken, refreshToken } = await this.authService.signIn(
    //   createAuthDto,
    // );
    // await saveTokenCookies(response, 'refreshToken', refreshToken, 'h');
    // return { accessToken };
  }

  @Get('signOut')
  @ApiOperation({ summary: 'signOut User' })
  async signOut(
    @Req() request: Request,
    // @Res({ passthrough: true }) response: Response,
    @Res() response: Response,
  ) {
    const { refreshToken } = request.signedCookies;
    await this.authService.signOut(refreshToken);
    await clearTokenCookies(response, 'refreshToken');
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'refresh Access Token' })
  async refreshAccess(@Req() request: Request) {
    const { refreshToken } = request.signedCookies;
    const { accessToken } = await this.authService.refreshAccess(refreshToken);
    return { accessToken };
  }

  @ApiOperation({ summary: 'Get Current User Info' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Get()
  async getCurrentUser(@Req() request: Request, @User() user) {
    const state = await this.userService.checkCoin(user._id, user.wallet);

    return {
      wallet: user.wallet,
      name: user.name,
      email: user.emailData.email,
      state: state,
    };
  }
}
