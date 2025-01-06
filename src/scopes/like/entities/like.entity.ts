import { 
  Entity, 
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn, 
} from 'typeorm';
import { AuthenticationUsers } from '../../authenticationUser/entities/authenticationUser.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => AuthenticationUsers, (user) => user.id)
  user: AuthenticationUsers;

  @ManyToOne(() => Post, { nullable: true })
  post?: Post;

  @ManyToOne(() => Comment, { nullable: true })
  comment?: Comment;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}