import { Article } from 'src/articles/entities/article.entity';
import { Consultation } from 'src/consultations/entities/consultation.entity';

import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'doctors' })
export class Doctor {
  @PrimaryColumn()
  uid: string;

  @OneToOne(() => User, (user) => user.doctor)
  user: User;

  @Column()
  specialization: string;

  @Column()
  workplace: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Consultation, (consultation) => consultation.doctor)
  consultations: Consultation[];
}
