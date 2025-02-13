import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Follow } from '../../follow/entities/follow.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class AuthenticationUsers {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'EMAIL', unique: true })
  email: string;

  @Column({ name: 'PASSWORD' })
  password: string;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'PROFILE_PICTURE', nullable: true })
  profilePicture?: string;

  @Column({ name: 'BIO', nullable: true })
  bio?: string;

  @Column({ name: 'LOCATION', nullable: true })
  location?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @Column({
    type: 'enum',
    enum: ['REGULAR', 'ADMIN', 'SPECTATOR'],
    default: 'REGULAR',
  })
  userType: 'REGULAR' | 'ADMIN' | 'SPECTATOR';

  @Column({ type: 'enum', enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' })
  accountStatus: 'ACTIVE' | 'SUSPENDED';

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updatedAt: Date;
}
