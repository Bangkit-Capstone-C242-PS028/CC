import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';

enum Role {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @ValidateIf((o) => o.role === Role.DOCTOR)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  specialization?: string;

  @IsOptional()
  @ValidateIf((o) => o.role === Role.DOCTOR)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  workplace?: string;

  @IsOptional()
  @ValidateIf((o) => o.role === Role.DOCTOR)
  @IsString()
  phoneNumber?: string;
}
