import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Doctor } from 'src/users/entities/doctor.entity';
import { Patient } from 'src/users/entities/patient.entity';
import { StorageService } from 'src/infrastructure/storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Patient, User])],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAdmin, StorageService],
})
export class AuthModule {}
