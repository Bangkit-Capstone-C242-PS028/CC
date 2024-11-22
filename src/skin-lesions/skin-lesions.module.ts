import { Module } from '@nestjs/common';
import { SkinLesionsService } from './skin-lesions.service';
import { SkinLesionsController } from './skin-lesions.controller';
import { StorageModule } from 'src/infrastructure/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkinLesion } from './entities/skin-lesion.entity';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';
import { PubsubModule } from 'src/infrastructure/pubsub/pubsub.module';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    StorageModule,
    PubsubModule,
    UserModule,
    TypeOrmModule.forFeature([SkinLesion]),
  ],
  controllers: [SkinLesionsController],
  providers: [SkinLesionsService, FirebaseAdmin],
})
export class SkinLesionsModule {}
