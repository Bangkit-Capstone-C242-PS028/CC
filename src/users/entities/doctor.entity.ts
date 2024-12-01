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

  @Column({ nullable: true })
  documentUrl: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column()
  whatsappUrl: string;

  @OneToMany(() => Article, (article) => article.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  articles: Article[];

  @OneToMany(() => Consultation, (consultation) => consultation.doctor, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  consultations: Consultation[];
}
