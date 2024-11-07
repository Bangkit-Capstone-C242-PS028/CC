import { User } from './user.entity';
import { Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryColumn()
  uid: string;

  @OneToOne(() => User, (user) => user.patient)
  user: User;
}
