import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteParams, DeleteFavoriteParams } from 'src/utils/types';
import { Article } from 'src/articles/entities/article.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,

    @InjectRepository(Article)
    private articleRepository: Repository<Article>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createFavoriteDetails: CreateFavoriteParams) {
    const [article, user] = await Promise.all([
      this.articleRepository.findOne({
        where: { id: createFavoriteDetails.articleId },
      }),
      this.userRepository.findOne({
        where: { uid: createFavoriteDetails.userId },
      }),
    ]);

    if (!article || !user) {
      throw new NotFoundException('Article or user not found');
    }

    const favorite = this.favoriteRepository.create({
      article,
      user,
    });
    await this.favoriteRepository.save(favorite);
    return favorite;
  }

  async remove(deleteFavoriteDetails: DeleteFavoriteParams) {
    const { articleId, userId } = deleteFavoriteDetails;

    const favorite = await this.favoriteRepository.findOne({
      where: {
        article: { id: articleId },
        user: { uid: userId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.delete(favorite.id);

    return favorite;
  }

  async findUserFavorites(userId: string) {
    const favorites = await this.favoriteRepository.find({
      where: { user: { uid: userId } },
      relations: { article: { author: { user: true } } },
    });
    return favorites;
  }

  async findArticleFavorites(articleId: number) {
    const favorites = await this.favoriteRepository.find({
      where: { article: { id: articleId } },
      relations: { article: { author: { user: true } } },
    });
    return favorites;
  }
}
