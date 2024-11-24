import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { Consultation } from './entities/consultation.entity';
import { ConsultationMessage } from './entities/consultation-message.entity';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consultation,
      ConsultationMessage,
      Doctor,
      Patient,
    ]),
  ],
  controllers: [ConsultationsController],
  providers: [ConsultationsService, FirebaseAdmin],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}

