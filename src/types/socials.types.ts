import { User } from '@prisma/client';

export type TUserSocial = Partial<
  Pick<User, 'email' | 'name' | 'avatarPath' | 'phone' | 'telegramId'>
>;
