import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import {
  FavoritesController,
  UsersFavoritesController,
} from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { User } from 'src/users/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [
    ArticlesModule,
    TypeOrmModule.forFeature([Favorite, User, Article]),
  ],
  controllers: [FavoritesController, UsersFavoritesController],
  providers: [FavoritesService, FirebaseAdmin],
})
export class FavoritesModule {}
