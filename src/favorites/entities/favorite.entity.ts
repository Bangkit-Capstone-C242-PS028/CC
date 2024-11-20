import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/entities/user.entity';

@Index(['article', 'user'], { unique: true })
@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Article)
  article: Article;

  @ManyToOne(() => User)
  user: User;
}
