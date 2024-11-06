import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { FirebaseAdmin } from 'config/firebase.setup';
import { Doctor } from 'src/users/entities/doctor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Doctor])],
  controllers: [ArticlesController],
  providers: [ArticlesService, FirebaseAdmin],
})
export class ArticlesModule {}