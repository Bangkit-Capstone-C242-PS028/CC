import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  Index,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/entities/user.entity';
import { nanoid } from 'nanoid';

@Index(['article', 'user'], { unique: true })
@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = nanoid();
  }

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article: Article;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
