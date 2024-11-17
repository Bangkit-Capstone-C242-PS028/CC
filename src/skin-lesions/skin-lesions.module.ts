import { Module } from '@nestjs/common';
import { SkinLesionsService } from './skin-lesions.service';
import { SkinLesionsController } from './skin-lesions.controller';
import { StorageModule } from 'src/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkinLesion } from './entities/skin-lesion.entity';
import { FirebaseAdmin } from 'config/firebase.setup';

@Module({
  imports: [StorageModule, TypeOrmModule.forFeature([SkinLesion])],
  controllers: [SkinLesionsController],
  providers: [SkinLesionsService, FirebaseAdmin],
})
export class SkinLesionsModule {}
