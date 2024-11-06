import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryColumn()
  uid: string;

  @Column()
  email: string;

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
}
