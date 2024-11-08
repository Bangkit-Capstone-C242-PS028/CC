import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ForbiddenException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { CreateFavoriteParams, DeleteFavoriteParams } from 'src/utils/types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/utils/pagination.helper';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @Auth('PATIENT', 'DOCTOR')
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req) {
    const { uid } = req.user;
    if (uid !== createFavoriteDto.userId) {
      throw new ForbiddenException('You are not allowed to do this');
    }

    const createFavoriteParams: CreateFavoriteParams = {
      articleId: createFavoriteDto.articleId,
      userId: createFavoriteDto.userId,
    };
    return this.favoritesService.create(createFavoriteParams);
  }

  @Get('users/:id')
  @Auth('PATIENT', 'DOCTOR')
  findUserFavorites(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit: number,
  ) {
    return this.favoritesService.findUserFavorites({ userId: id, page, limit });
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
    return this.favoritesService.findArticleFavorites({
      articleId: +id,
      page,
      limit,
    });
  }

  @Delete('users/:userId/articles/:articleId')
  @Auth('PATIENT', 'DOCTOR')
  remove(
    @Param('userId') userId: string,
    @Param('articleId') articleId: string,
    @Req() req,
  ) {
    const { uid } = req.user;
    if (uid !== userId) {
      throw new ForbiddenException('You are not allowed to do this');
    }

    const deleteFavoriteParams: DeleteFavoriteParams = {
      articleId: +articleId,
      userId,
    };
    return this.favoritesService.remove(deleteFavoriteParams);
  }
}
