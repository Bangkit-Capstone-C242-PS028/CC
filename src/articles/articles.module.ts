import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';
import { Doctor } from 'src/users/entities/doctor.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { GamificationModule } from 'src/gamification/gamification.module';

@Module({
  imports: [
    StorageModule,
    TypeOrmModule.forFeature([Article, Doctor, Favorite]),
    GamificationModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, FirebaseAdmin],
  exports: [ArticlesService],
})
export class ArticlesModule {}
