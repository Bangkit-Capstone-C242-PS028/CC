import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { FirebaseAdmin } from 'config/firebase.setup';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Article])],
  controllers: [FavoritesController],
  providers: [FavoritesService, FirebaseAdmin],
})
export class FavoritesModule {}
