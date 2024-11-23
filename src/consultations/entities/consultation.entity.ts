import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../../users/entities/doctor.entity';
import { Patient } from '../../users/entities/patient.entity';
import { ConsultationMessage } from './consultation-message.entity';

export enum ConsultationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

@Entity({ name: 'consultations' })
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.consultations)
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.consultations)
  patient: Patient;

  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.PENDING,
  })
  status: ConsultationStatus;

  @Column()
  requestedAt: Date;

  @Column({ nullable: true })
  acceptedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @OneToMany(() => ConsultationMessage, (message) => message.consultation)
  messages: ConsultationMessage[];
}

