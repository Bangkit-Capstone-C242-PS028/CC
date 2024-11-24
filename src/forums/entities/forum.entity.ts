import { Doctor } from 'src/users/entities/doctor.entity';
import { Patient } from 'src/users/entities/patient.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { ForumReply } from './forum-reply.entity';

@Entity('forums')
export class Forum {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid();
  }

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

  @OneToMany(() => ForumReply, (reply) => reply.forum, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  replies: ForumReply[];
}
