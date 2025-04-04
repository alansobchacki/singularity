import { User } from "../user/User";

export type FollowStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Follow {
  id: string;
  follower: User;        
  following: User;
  status: FollowStatus;
  createdAt?: Date;
  updatedAt?: Date;
}