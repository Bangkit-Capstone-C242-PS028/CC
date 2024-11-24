import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import {
  CreateFavoriteParams,
  DeleteFavoriteParams,
  FindUserFavoritesParams,
  FindArticleFavoritesParams,
  PaginatedResponse,
} from 'src/utils/types';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  getPaginationParams,
} from 'src/utils/pagination.helper';
import { ArticlesService } from 'src/articles/articles.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    private readonly articlesService: ArticlesService,
  ) {}

  async create(params: CreateFavoriteParams) {
    const { articleId, userId } = params;

    // check if article exists
    const article = await this.articlesService.findOne({ id: articleId });
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if favorite already exists
    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        article: { id: articleId },
        user: { uid: userId },
      },
    });

    if (existingFavorite) {
      throw new BadRequestException('Article is already in favorites');
    }

    const favorite = this.favoriteRepository.create({
      article: { id: articleId },
      user: { uid: userId },
    });

    await this.favoriteRepository.save(favorite);
  }

  async findUserFavorites(
    params: FindUserFavoritesParams,
  ): Promise<PaginatedResponse<Favorite>> {
    const { userId, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { skip, take } = getPaginationParams(page, limit);

    const [data, total] = await this.favoriteRepository.findAndCount({
      where: { user: { uid: userId } },
      relations: { article: { author: { user: true } } },
      take,
      skip,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findArticleFavorites(
    params: FindArticleFavoritesParams,
  ): Promise<PaginatedResponse<Favorite>> {
    const { articleId, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { skip, take } = getPaginationParams(page, limit);

    const [data, total] = await this.favoriteRepository.findAndCount({
      where: { article: { id: articleId } },
      relations: { article: { author: { user: true } } },
      take,
      skip,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
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

    await this.favoriteRepository.remove(favorite);
  }
}
