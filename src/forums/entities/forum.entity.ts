import { Doctor } from 'src/users/entities/doctor.entity';
import { Patient } from 'src/users/entities/patient.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ForumReply } from './forum-reply.entity';

@Entity('forums')
export class Forum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: 'open' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient)
  patient: Patient;

  @ManyToOne(() => Doctor, { nullable: true })
  doctor: Doctor;

  @OneToMany(() => ForumReply, (reply) => reply.forum, { nullable: true })
  replies: ForumReply[];
}
