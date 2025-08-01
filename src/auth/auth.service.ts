import { PrismaService } from '@/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { Role, User } from '@prisma/client';
import { UserService } from '@/user/user.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  private readonly TOKEN_EXPIRATION_ACCESS = '1h';
  private readonly TOKEN_EXPIRATION_REFRESH = '7d';

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);

    return this.buildResponseObject(user);
  }

  async register(dto: AuthDto) {
    const isUserAlreadyExists = await this.userService.getByEmail(dto.email);

    if (isUserAlreadyExists) throw new ConflictException('A user with this email already exists!');

    const user = await this.userService.create(dto);

    await this.emailService.sendVerification(user.email!, user.verificationToken!);

    return this.buildResponseObject(user);
  }

  async getNewTokens(refreshToken: string) {
    const result: User = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token');

    const user = await this.userService.getById(result.id);

    return this.buildResponseObject(user);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) throw new NotFoundException('User does not exists!');

    await this.userService.update(user.id, {
      verificationToken: null,
    });

    return 'Email verified!';
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async buildResponseObject(user: User) {
    const tokens = this.issueTokens(user.id, user.rights || []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, ...tokens };
  }

  private issueTokens(userId: string, rights: Role[]) {
    const payload = { id: userId, rights };
    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.TOKEN_EXPIRATION_ACCESS,
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: this.TOKEN_EXPIRATION_REFRESH,
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found! Please check the entered data!');

    if (user.password) {
      const isValidPassword = await verify(user.password, dto.password);

      if (!isValidPassword) throw new UnauthorizedException('Incorrect password!');
    }

    return user;
  }
}
