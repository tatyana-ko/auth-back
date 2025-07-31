import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { RefreshTokenService } from './refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Recaptcha()
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Recaptcha()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @HttpCode(200)
  @Get('verify-email')
  async verifyEmail(@Query('token') token?: string) {
    if (!token) {
      throw new UnauthorizedException('Token not passed');
    }

    return this.authService.verifyEmail(token);
  }

  @HttpCode(200)
  @Post('logout')
  // eslint-disable-next-line @typescript-eslint/require-await
  async logout(@Res({ passthrough: true }) res: Response) {
    this.refreshTokenService.removeRefreshTokenFromResponse(res);

    return true;
  }
}
