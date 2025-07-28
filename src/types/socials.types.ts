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

export interface IYandexProfile {
  id: string;
  username: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  gender: string | null;
  emails: Array<{
    value: string;
  }>;
  photos: Array<{
    value: string;
    type: string;
  }>;
}

export interface IGithubProfile {
  id: string;
  nodeId: string;
  displayName: string | null;
  username: string;
  profileUrl: string;
  photos: Array<{
    value: string;
  }>;
  emails: Array<{
    value: string;
  }>;
}

export type TSocialCallback = (error: any, user: TUserSocial, info?: any) => void;
