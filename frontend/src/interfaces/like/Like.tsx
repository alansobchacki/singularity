import { User } from "../user/User";
import { Comment } from "../comment/Comment";
import Post from "../post/Post";

export default interface Like {
  id: string;
  user: User;
  post?: Post | null;
  comment?: Comment | null;
  createdAt?: Date | string;
}