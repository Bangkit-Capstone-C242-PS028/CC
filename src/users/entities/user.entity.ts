import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  uid: string;

  @Column()
  role: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dob: Date;

  @Column()
  address: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  points: number;

  @OneToOne(() => Doctor, (doctor) => doctor.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  doctor: Doctor;

  @OneToOne(() => Patient, (patient) => patient.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patient: Patient;

  @OneToMany(() => Favorite, (favorite) => favorite.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  favorites: Favorite[];

  toResponse() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
