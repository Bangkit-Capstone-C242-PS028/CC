import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import {
  CreateFavoriteParams,
  DeleteFavoriteParams,
  FindArticleFavoritesParams,
  FindUserFavoritesParams,
} from 'src/utils/types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/utils/pagination.helper';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('articles')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':id/favorites')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('Article added to favorites successfully')
  create(@Param('id') id: string, @Req() req) {
    const { uid } = req.user;

    const createFavoriteParams: CreateFavoriteParams = {
      articleId: id,
      userId: uid,
    };
    return this.favoritesService.create(createFavoriteParams);
  }

  @Get(':id/favorites')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('Article favorites retrieved successfully')
  findArticleFavorites(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit: number,
  ) {
    const findArticleFavoritesDetails: FindArticleFavoritesParams = {
      articleId: id,
      page,
      limit,
    };
    return this.favoritesService.findArticleFavorites(
      findArticleFavoritesDetails,
    );
  }

  @Delete(':id/favorites')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('Article removed from favorites successfully')
  remove(@Param('id') id: string, @Req() req) {
    const { uid } = req.user;

    const deleteFavoriteDetails: DeleteFavoriteParams = {
      articleId: id,
      userId: uid,
    };
    return this.favoritesService.remove(deleteFavoriteDetails);
  }
}

@Controller('favorites')
export class UsersFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('my')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('User favorites retrieved successfully')
  findUserFavorites(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit: number,
    @Req() req,
  ) {
    const { uid } = req.user;

    const findUserFavoritesDetails: FindUserFavoritesParams = {
      userId: uid,
      page,
      limit,
    };
    return this.favoritesService.findUserFavorites(findUserFavoritesDetails);
  }
}
