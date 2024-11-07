import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Auth } from 'src/decorators/auth.decorator';

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

    const createFavoriteDetails = {
      ...createFavoriteDto,
    };
    return this.favoritesService.create(createFavoriteDetails);
  }

  @Get('users/:id')
  @Auth('PATIENT', 'DOCTOR')
  findUserFavorites(@Param('id') id: string) {
    return this.favoritesService.findUserFavorites(id);
  }

  @Get('articles/:id')
  @Auth('PATIENT', 'DOCTOR')
  findArticleFavorites(@Param('id') id: string) {
    return this.favoritesService.findArticleFavorites(+id);
  }

  @Delete('users/:userId/articles/:articleId')
  @Auth('PATIENT', 'DOCTOR')
  remove(
    @Param('userId') userId: string,
    @Param('articleId') articleId: number,
    @Req() req,
  ) {
    const { uid } = req.user;
    if (uid !== userId) {
      throw new ForbiddenException('You are not allowed to do this');
    }

    const deleteFavoriteDetails = {
      articleId: +articleId,
      userId,
    };

    return this.favoritesService.remove(deleteFavoriteDetails);
  }
}
