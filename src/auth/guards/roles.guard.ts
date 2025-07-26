import { AuthRequest } from '@/types/auth.types';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    const hasRole = () => user.rights.some((role) => roles.includes(role));

    if (!hasRole()) throw new ForbiddenException('You have no rights!');

    return true;
  }
}
