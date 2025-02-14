import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Check,
} from 'typeorm';
import { AuthenticationUsers } from '../../authenticationUser/entities/authenticationUser.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
@Unique(['user', 'post', 'comment'])
@Check(
  `("postId" IS NOT NULL AND "commentId" IS NULL) OR ("postId" IS NULL AND "commentId" IS NOT NULL)`,
)
export class Like {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => AuthenticationUsers, (user) => user.id)
  user: AuthenticationUsers;

  @ManyToOne(() => Post, { nullable: true, onDelete: 'CASCADE' })
  post?: Post;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE' })
  comment?: Comment;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}
