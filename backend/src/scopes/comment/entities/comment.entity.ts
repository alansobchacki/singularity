import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne,
  CreateDateColumn, 
  UpdateDateColumn,
} from 'typeorm';
import { AuthenticationUsers } from '../../authenticationUser/entities/authenticationUser.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'CONTENT' })
  content: string;

  @ManyToOne(() => AuthenticationUsers, (user) => user.id)
  author: AuthenticationUsers;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt: Date;
}