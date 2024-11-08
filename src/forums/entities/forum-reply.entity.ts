import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Forum } from './forum.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('forum_replies')
export class ForumReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  forum_id: number;

  @Column()
  responder_role: string; // 'doctor' or 'patient'

  @ManyToOne(() => User)
  responder: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Forum, (forum) => forum.replies)
  forum: Forum;
}
