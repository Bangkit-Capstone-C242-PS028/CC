import { Patient } from 'src/users/entities/patient.entity';
import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

export enum SkinLesionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('skin_lesions')
export class SkinLesion {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Patient)
  patient: Patient;

  @Column()
  originalImageUrl: string;

  @Column({ nullable: true })
  processedImageUrl: string;

  @Column({
    type: 'enum',
    enum: SkinLesionStatus,
    default: SkinLesionStatus.PENDING,
  })
  status: SkinLesionStatus;

  @Column({ nullable: true })
  classification: string;

  @Column({ nullable: true })
  severity: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  processedAt: Date;
}
