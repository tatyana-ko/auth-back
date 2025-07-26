import { AuthRequest } from '@/types/auth.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();
  const user = request.user;

  return data ? user[data] : user;
});
