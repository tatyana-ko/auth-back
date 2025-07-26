import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Authorization = (roles: Role[] | Role = Role.USER) => {
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];

  if (normalizedRoles.length > 0) {
    return applyDecorators(Roles(...normalizedRoles), UseGuards(JwtAuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(JwtAuthGuard));
};
