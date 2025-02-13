import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { AuthenticationUsers } from '../../authenticationUser/entities/authenticationUser.entity';

@Entity()
@Unique(['follower', 'following'])
export class Follow {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => AuthenticationUsers, (user) => user.following)
  follower: AuthenticationUsers;

  @ManyToOne(() => AuthenticationUsers, (user) => user.followers)
  following: AuthenticationUsers;

  @Column({ type: 'enum', enum: ['PENDING', 'ACCEPTED'], default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED';

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}
