import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'src/firebase/firebase.setup';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient, User])],
  controllers: [UsersController],
  providers: [UsersService, FirebaseAdmin],
  exports: [UsersService],
})
export class UserModule {}
