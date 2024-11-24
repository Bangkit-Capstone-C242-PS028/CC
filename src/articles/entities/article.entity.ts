import { Favorite } from 'src/favorites/entities/favorite.entity';
import { Doctor } from 'src/users/entities/doctor.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid();
  }

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.articles, { onDelete: 'CASCADE' })
  author: Doctor;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.article, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  favorites: Favorite[];
}
