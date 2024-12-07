import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'activity_logs' })
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.activityLogs, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  activity: string;

  @Column()
  points: number;

  @CreateDateColumn()
  createdAt: Date;
}
