import { User } from "../user/User";
import Post from "../post/Post";
import Like from "../like/Like";

export type CommentStatus = 'REGULAR' | 'ARCHIVED';

export interface Comment {
  id: string;
  content: string;
  image?: string | null;
  edited?: boolean;
  status: CommentStatus;
  author: User;
  post: Post;
  likes: Like[];
  createdAt?: Date;
  updatedAt?: Date;
}