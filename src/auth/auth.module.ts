import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@/prisma.service';
import { UserModule } from '@/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '@/configs/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { getRecaptchaConfig } from '@/configs/recaptcha.config';
import { SocialsController } from './socials/socials.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { SocialsService } from './socials/socials.service';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  controllers: [AuthController, SocialsController],
  providers: [
    AuthService,
    SocialsService,
    PrismaService,
    JwtStrategy,
    GoogleStrategy,
    RefreshTokenService,
  ],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
