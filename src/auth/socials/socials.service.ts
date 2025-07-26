import { TUserSocial } from '@/types/socials.types';
import { UserService } from '@/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class SocialsService {
  constructor(private userService: UserService) {}

  async login(req: { user: TUserSocial }) {
    if (!req.user) throw new BadRequestException('User not found by social media');

    return this.userService.getUserOrCreateWithSocials(req.user);
  }
}
