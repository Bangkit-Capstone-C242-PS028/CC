import { Consultation } from 'src/consultations/entities/consultation.entity';
import { User } from './user.entity';
import { Entity, OneToOne, PrimaryColumn, OneToMany } from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryColumn()
  uid: string;

  @OneToOne(() => User, (user) => user.patient)
  user: User;

  @OneToMany(() => Consultation, (consultation) => consultation.patient)
  consultations: Consultation[];
}
