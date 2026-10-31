import { User } from "../user/User";
import { Comment } from "../comment/Comment";
import Like from "../like/Like";

export default interface Post {
  id: string;
  content: string;
  author: User;
  comments: Comment[];
  likes: Like[];
  isPinned: boolean;
  isDeleted: boolean;
  commentsDisabled: boolean;
  editedBy: "AUTHOR" | "MODERATION" | null;
  createdAt?: Date;
  updatedAt?: Date;
}