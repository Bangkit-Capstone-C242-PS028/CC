import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient])],
  controllers: [UsersController],
  providers: [UsersService, FirebaseAdmin],
})
export class UserModule {}
