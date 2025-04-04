import { User } from "../user/User";
import { Comment } from "../comment/Comment";
import Like from "../like/Like";

export default interface Post {
  id: string;
  content: string;
  author: User;
  comments: Comment[];
  likes: Like[];
  createdAt?: Date;
  updatedAt?: Date;
}