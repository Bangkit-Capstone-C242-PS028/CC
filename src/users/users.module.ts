import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient])],
  controllers: [UserController],
  providers: [UserService, FirebaseAdmin],
})
export class UserModule {}
