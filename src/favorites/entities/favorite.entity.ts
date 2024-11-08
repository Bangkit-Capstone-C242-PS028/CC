import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/entities/user.entity';

@Index(['article_id', 'user_id'], { unique: true })
@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  article_id: number;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Article)
  article: Article;

  @ManyToOne(() => User)
  user: User;
}
