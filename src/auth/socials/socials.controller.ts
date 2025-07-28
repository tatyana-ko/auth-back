import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SocialsService } from './socials.service';
import { AuthGuard } from '@nestjs/passport';
import { TUserSocial } from '@/types/socials.types';
import { AuthService } from '../auth.service';
import { RefreshTokenService } from '../refresh-token.service';

@Controller('auth')
export class SocialsController {
  constructor(
    private readonly socialsService: SocialsService,
    private authService: AuthService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  private _CLIENT_BASE_URL = 'http://localhost:3000/social-auth?accessToken=';

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: { user: TUserSocial },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.socialsService.login(req);

    const { accessToken, refreshToken } = await this.authService.buildResponseObject(user);

    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

    return res.redirect(`${this._CLIENT_BASE_URL}${accessToken}`);
  }

  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() {}

  @Get('yandex/redirect')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthRedirect(
    @Req() req: { user: TUserSocial },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.socialsService.login(req);

    const { accessToken, refreshToken } = await this.authService.buildResponseObject(user);

    this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

    return res.redirect(`${this._CLIENT_BASE_URL}${accessToken}`);
  }
}
