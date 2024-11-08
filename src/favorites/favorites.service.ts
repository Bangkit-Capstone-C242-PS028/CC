import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import {
  CreateFavoriteParams,
  DeleteFavoriteParams,
  FindUserFavoritesParams,
  FindArticleFavoritesParams,
} from 'src/utils/types';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async create(params: CreateFavoriteParams) {
    const { articleId, userId } = params;
    const favorite = this.favoriteRepository.create({
      article: { id: articleId },
      user: { uid: userId },
    });
    return this.favoriteRepository.save(favorite);
  }

  async findUserFavorites(params: FindUserFavoritesParams) {
    const { userId } = params;
    return this.favoriteRepository.find({
      where: { user: { uid: userId } },
      relations: { article: { author: { user: true } } },
    });
  }

  async findArticleFavorites(params: FindArticleFavoritesParams) {
    const { articleId } = params;
    return this.favoriteRepository.find({
      where: { article: { id: articleId } },
      relations: { article: { author: { user: true } } },
    });
  }

  async remove(params: DeleteFavoriteParams) {
    const { articleId, userId } = params;
    const favorite = await this.favoriteRepository.findOne({
      where: {
        article: { id: articleId },
        user: { uid: userId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return this.favoriteRepository.remove(favorite);
  }
}
