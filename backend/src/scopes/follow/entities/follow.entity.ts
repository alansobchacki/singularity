import { 
  Entity, 
  PrimaryGeneratedColumn, 
  ManyToOne,
  CreateDateColumn, 
} from 'typeorm';
import { AuthenticationUsers } from '../../authenticationUser/entities/authenticationUser.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => AuthenticationUsers, (user) => user.following)
  follower: AuthenticationUsers;

  @ManyToOne(() => AuthenticationUsers, (user) => user.followers)
  following: AuthenticationUsers;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}
