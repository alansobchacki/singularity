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

  @ManyToOne(() => AuthenticationUsers, (user) => user.id)
  follower: AuthenticationUsers;

  @ManyToOne(() => AuthenticationUsers, (user) => user.id)
  following: AuthenticationUsers;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createdAt: Date;
}
