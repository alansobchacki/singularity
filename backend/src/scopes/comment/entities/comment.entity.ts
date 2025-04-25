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
import { Like } from '../../like/entities/like.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'CONTENT' })
  content: string;

  @Column({ name: 'IMAGE', nullable: true })
  image: string;

  @Column({ name: 'EDITED', default: false })
  edited: boolean;

  @Column({
    type: 'enum',
    enum: ['REGULAR', 'ARCHIVED'],
    default: 'REGULAR',
  })
  status: 'REGULAR' | 'ARCHIVED';

  @ManyToOne(() => AuthenticationUsers, (user) => user.id)
  author: AuthenticationUsers;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @OneToMany(() => Like, (like) => like.comment, { cascade: true })
  likes: Like[];

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt: Date;
}
