import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { Patient } from 'src/typeorm/entities/Patient';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient])],
  controllers: [UserController],
  providers: [UserService, FirebaseAdmin],
})
export class UserModule {}
