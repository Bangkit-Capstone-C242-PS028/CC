import { Consultation } from 'src/consultations/entities/consultation.entity';
import { User } from './user.entity';
import { Entity, OneToOne, PrimaryColumn, OneToMany } from 'typeorm';
import { Forum } from 'src/forums/entities/forum.entity';
import { SkinLesion } from 'src/skin-lesions/entities/skin-lesion.entity';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryColumn()
  uid: string;

  @OneToOne(() => User, (user) => user.patient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Consultation, (consultation) => consultation.patient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  consultations: Consultation[];

  @OneToMany(() => Forum, (forum) => forum.patient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  forums: Forum[];

  @OneToMany(() => SkinLesion, (skinLesion) => skinLesion.patient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  skinLesions: SkinLesion[];
}
