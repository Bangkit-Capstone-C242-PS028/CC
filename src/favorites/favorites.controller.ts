import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Auth } from 'src/decorators/auth.decorator';
import {
  CreateFavoriteParams,
  DeleteFavoriteParams,
  FindArticleFavoritesParams,
  FindUserFavoritesParams,
} from 'src/utils/types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/utils/pagination.helper';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Auth('PATIENT', 'DOCTOR')
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req) {
    const { uid } = req.user;

    const createFavoriteParams: CreateFavoriteParams = {
      articleId: createFavoriteDto.articleId,
      userId: uid,
    };
    return this.favoritesService.create(createFavoriteParams);
  }

  @Get('my')
  @Auth('PATIENT', 'DOCTOR')
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

  @Get('articles/:id')
  @Auth('PATIENT', 'DOCTOR')
  findArticleFavorites(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit: number,
  ) {
    const findArticleFavoritesDetails: FindArticleFavoritesParams = {
      articleId: +id,
      page,
      limit,
    };
    return this.favoritesService.findArticleFavorites(
      findArticleFavoritesDetails,
    );
  }

  @Delete('articles/:id')
  @Auth('PATIENT', 'DOCTOR')
  remove(@Param('id') id: string, @Req() req) {
    const { uid } = req.user;

    const deleteFavoriteDetails: DeleteFavoriteParams = {
      articleId: +id,
      userId: uid,
    };
    return this.favoritesService.remove(deleteFavoriteDetails);
  }
}
