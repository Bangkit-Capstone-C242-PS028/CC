import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Consultation,
  ConsultationStatus,
} from './entities/consultation.entity';
import { ConsultationMessage } from './entities/consultation-message.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consultationsRepository: Repository<Consultation>,
    @InjectRepository(ConsultationMessage)
    private messagesRepository: Repository<ConsultationMessage>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async createConsultation(
    patientUid: string,
    createConsultationDto: CreateConsultationDto,
  ) {
    const patient = await this.patientsRepository.findOne({
      where: { uid: patientUid },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doctor = await this.doctorsRepository.findOne({
      where: { uid: createConsultationDto.doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const consultation = this.consultationsRepository.create({
      doctor,
      patient,
      requestedAt: new Date(),
      status: ConsultationStatus.PENDING,
    });

    const savedConsultation =
      await this.consultationsRepository.save(consultation);

    return savedConsultation.id; 
  }

  async acceptConsultation(doctorUid: string, consultationId: string) {
    const consultation = await this.consultationsRepository.findOne({
      where: { id: consultationId },
      relations: ['doctor'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.doctor.uid !== doctorUid) {
      throw new BadRequestException(
        'Not authorized to accept this consultation',
      );
    }

    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException('Consultation is not in pending state');
    }

    consultation.status = ConsultationStatus.ACCEPTED;
    consultation.acceptedAt = new Date();

    return this.consultationsRepository.save(consultation);
  }

  async declineConsultation(doctorUid: string, consultationId: string) {
    const consultation = await this.consultationsRepository.findOne({
      where: { id: consultationId },
      relations: ['doctor'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.doctor.uid !== doctorUid) {
      throw new BadRequestException(
        'Not authorized to decline this consultation',
      );
    }

    consultation.status = ConsultationStatus.DECLINED;
    return this.consultationsRepository.save(consultation);
  }

  async sendMessage(
    userUid: string,
    consultationId: string,
    createMessageDto: CreateMessageDto,
  ) {
    const consultation = await this.consultationsRepository.findOne({
      where: { id: consultationId },
      relations: ['doctor', 'patient'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.status !== ConsultationStatus.ACCEPTED) {
      throw new BadRequestException(
        'Cannot send message to non-active consultation',
      );
    }

    if (
      consultation.doctor.uid !== userUid &&
      consultation.patient.uid !== userUid
    ) {
      throw new BadRequestException(
        'Not authorized to send message in this consultation',
      );
    }

    const message = this.messagesRepository.create({
      consultation,
      content: createMessageDto.content,
      sentAt: new Date(),
      sender: { uid: userUid } as User,
    });

    return this.messagesRepository.save(message);
  }

  async getConsultationMessages(userUid: string, consultationId: string) {
    const consultation = await this.consultationsRepository.findOne({
      where: { id: consultationId },
      relations: ['doctor', 'patient', 'messages', 'messages.sender'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (
      consultation.doctor.uid !== userUid &&
      consultation.patient.uid !== userUid
    ) {
      throw new BadRequestException('Not authorized to view this consultation');
    }

    return consultation.messages;
  }
}
