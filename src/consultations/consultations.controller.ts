import { Controller, Post, Get, Param, Body, Request } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @Auth('PATIENT')
  createConsultation(
    @Body() createConsultationDto: CreateConsultationDto,
    @Request() req,
  ) {
    return this.consultationsService.createConsultation(
      req.user.uid,
      createConsultationDto,
    );
  }

  @Post(':id/accept')
  @Auth('DOCTOR')
  acceptConsultation(@Param('id') id: string, @Request() req) {
    return this.consultationsService.acceptConsultation(req.user.uid, id);
  }

  @Post(':id/decline')
  @Auth('DOCTOR')
  declineConsultation(@Param('id') id: string, @Request() req) {
    return this.consultationsService.declineConsultation(req.user.uid, id);
  }

  @Post(':id/messages')
  @Auth('DOCTOR', 'PATIENT')
  sendMessage(
    @Param('id') id: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    return this.consultationsService.sendMessage(
      req.user.uid,
      id,
      createMessageDto,
    );
  }

  @Get(':id/messages')
  @Auth('DOCTOR', 'PATIENT')
  getMessages(@Param('id') id: string, @Request() req) {
    return this.consultationsService.getConsultationMessages(req.user.uid, id);
  }

  @Get('pending')
  @Auth('DOCTOR')
  async getPendingConsultations(@Request() req) {
    return this.consultationsService.getPendingConsultations(req.user.uid);
  }

  @Get(':id/status')
  @Auth('DOCTOR', 'PATIENT')
  async getConsultationStatus(@Param('id') id: string, @Request() req) {
    return this.consultationsService.getConsultationStatus(req.user.uid, id);
  }

  @Get('all')
  @Auth('DOCTOR')
  async getAllConsultations(@Request() req) {
    return this.consultationsService.getAllConsultations(req.user.uid);
  }
}

