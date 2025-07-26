import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '@/auth/decorators/user.decorator';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getById(id);
  }

  @Authorization([Role.ADMIN])
  @HttpCode(HttpStatus.OK)
  @Get('admin')
  getProfileByAdmin() {
    return { text: 'Admin content' };
  }
}
