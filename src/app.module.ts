import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { FirebaseAdmin } from '../config/firebase.setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './users/entities/doctor.entity';
import { Patient } from './users/entities/patient.entity';
import { ArticlesModule } from './articles/articles.module';
import { Article } from './articles/entities/article.entity';
import { FavoritesModule } from './favorites/favorites.module';
import { Favorite } from './favorites/entities/favorite.entity';
import { User } from './users/entities/user.entity';
import { ForumsModule } from './forums/forums.module';
import { Forum } from './forums/entities/forum.entity';
import { ForumReply } from './forums/entities/forum-reply.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',

      // local mysql
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT),

      // cloud sql
      host: process.env.PRODUCTION
        ? `/cloudsql/${process.env.CONNECTION_NAME}`
        : process.env.DB_HOST,
      extra: {
        socketPath: process.env.PRODUCTION
          ? `/cloudsql/${process.env.CONNECTION_NAME}`
          : undefined,
      },

      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Doctor, Patient, Article, Favorite, Forum, ForumReply],
      synchronize: true,
    }),

    UserModule,

    ArticlesModule,

    FavoritesModule,

    ForumsModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAdmin],
})
export class AppModule {}
