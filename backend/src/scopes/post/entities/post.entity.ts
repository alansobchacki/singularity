import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthenticationUsers } from '../../authenticationUser/entities/authenticationUser.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'CONTENT' })
  content: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => AuthenticationUsers, (user) => user.posts)
  author: AuthenticationUsers;

  @OneToMany(() => Like, (like) => like.post, { cascade: true })
  likes: Like[];

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt: Date;
}
