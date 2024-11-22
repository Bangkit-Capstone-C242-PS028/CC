import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { FirebaseAdmin } from './infrastructure/firebase/firebase.setup';
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
import { AuthModule } from './auth/auth.module';
import { SkinLesionsModule } from './skin-lesions/skin-lesions.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { SkinLesion } from './skin-lesions/entities/skin-lesion.entity';
import { PubsubModule } from './infrastructure/pubsub/pubsub.module';

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
      host:
        process.env.ENV === 'prod'
          ? `/cloudsql/${process.env.CONNECTION_NAME}`
          : process.env.DB_HOST,
      extra: {
        socketPath:
          process.env.ENV === 'prod'
            ? `/cloudsql/${process.env.CONNECTION_NAME}`
            : undefined,
      },

      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Doctor,
        Patient,
        Article,
        Favorite,
        Forum,
        ForumReply,
        SkinLesion,
      ],
      synchronize: true,
    }),

    AuthModule,

    UserModule,

    ArticlesModule,

    FavoritesModule,

    ForumsModule,

    SkinLesionsModule,

    StorageModule,

    PubsubModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAdmin],
})
export class AppModule {}
