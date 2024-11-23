import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConsultationDto {
  @IsNotEmpty()
  //@IsUUID() // firebase uuid  
  doctorId: string;
}
