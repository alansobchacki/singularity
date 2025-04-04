import { Comment } from '../comment/Comment';
import { Follow } from '../follow/Follow';
import Post from '../post/Post';

export type UserType = 'REGULAR' | 'BOT' | 'ADMIN' | 'SPECTATOR';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email?: string;
  name: string;
  profilePicture?: string | null;
  bio?: string | null;
  location?: string | null;
  userType: UserType;
  accountStatus: AccountStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  posts?: Post[];
  comments?: Comment[];
  following?: Follow[];
  followers?: Follow[];
}