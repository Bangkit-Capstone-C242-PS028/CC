import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Forum } from './forum.entity';
import { User } from 'src/users/entities/user.entity';
import { nanoid } from 'nanoid';

@Entity('forum_replies')
export class ForumReply {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid();
  }

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
