import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique
} from 'typeorm';
import { AuthenticationUsers } from '../../authenticationUser/entities/authenticationUser.entity';

@Entity()
@Unique(['requester', 'receiver'])
export class FollowRequest {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => AuthenticationUsers, (user) => user.sentFollowRequests)
  requester: AuthenticationUsers;

  @ManyToOne(() => AuthenticationUsers, (user) => user.receivedFollowRequests)
  receiver: AuthenticationUsers;

  @Column({ type: 'enum', enum: ['PENDING', 'ACCEPTED', 'DECLINED'], default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}
