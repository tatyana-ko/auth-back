import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
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

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Patch('update-email')
  async updateEmail(@CurrentUser('id') id: string, @Body() dto: { email: string }) {
    return this.userService.update(id, { email: dto.email });
  }
}
