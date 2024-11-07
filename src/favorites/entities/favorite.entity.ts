import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.favorites)
  article: Article;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
