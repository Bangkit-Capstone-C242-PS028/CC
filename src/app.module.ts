import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FirebaseAdmin } from '../config/firebase.setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './user/entities/doctor.entity';
import { Patient } from './user/entities/patient.entity';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Doctor, Patient],
      synchronize: true,
    }),

    UserModule,

    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAdmin],
})
export class AppModule {}
