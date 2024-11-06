import { Article } from 'src/articles/entities/article.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'doctors' })
export class Doctor {
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

  @Column()
  specialization: string;

  @Column()
  workplace: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
