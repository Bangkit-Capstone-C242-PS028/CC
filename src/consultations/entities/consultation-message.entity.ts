import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Consultation } from './consultation.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'consultation_messages' })
export class ConsultationMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Consultation, (consultation) => consultation.messages, {
    onDelete: 'CASCADE',
  })
  consultation: Consultation;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;

  @Column()
  content: string;

  @Column()
  sentAt: Date;
}
