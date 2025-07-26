import { User } from '@prisma/client';

export type TUserSocial = Partial<
  Pick<User, 'email' | 'name' | 'avatarPath' | 'phone' | 'telegramId'>
>;

export interface IGoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
}

export type TSocialCallback = (error: any, user: TUserSocial, info?: any) => void;
