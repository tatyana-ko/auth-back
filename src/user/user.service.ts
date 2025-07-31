import { AuthDto } from '@/auth/dto/auth.dto';
import { PrismaService } from '@/prisma.service';
import { TUserSocial } from '@/types/socials.types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(`User doesn't exists!`);

    return user;
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(dto: AuthDto) {
    const newUser = await this.prisma.user.create({
      data: { ...dto, password: await hash(dto.password) },
    });

    return newUser;
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return user;
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getUserOrCreateWithSocials(profile: TUserSocial) {
    const email = profile.email;
    let user: User | null = null;

    if (email) {
      user = await this.getByEmail(email);
    }

    if (!user) {
      const verificationToken = profile.email
        ? {
            verificationToken: null,
          }
        : {};

      return this.prisma.user.create({
        data: {
          email: profile.email || '',
          name: profile.name || '',
          password: '',
          ...verificationToken,
          avatarPath: profile.avatarPath || null,
        },
      });
    }

    return user;
  }
}
