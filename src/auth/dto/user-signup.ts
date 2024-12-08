import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsEnum,
  IsAlpha,
  IsISO8601,
  ValidateIf,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

enum Role {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
}

export class UserSignupDto {
  @IsNotEmpty()
  @IsEnum(Role, { each: true })
  role: Role;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
    {
      message: 'password too weak',
    },
  )
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]{8,}$/,
    {
      message: 'password too weak',
    },
  )
  confirmPassword: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @IsAlpha()
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @IsAlpha()
  lastName: string;

  @IsNotEmpty()
  @IsISO8601()
  dob: Date;

  @IsNotEmpty()
  address: string;

  @ValidateIf((o) => o.role === Role.DOCTOR)
  @IsNotEmpty()
  specialization: string;

  @ValidateIf((o) => o.role === Role.DOCTOR)
  @IsNotEmpty()
  workplace: string;

  @ValidateIf((o) => o.role === Role.DOCTOR)
  @IsNotEmpty()
  @IsPhoneNumber('ID', {})
  phoneNumber: string;
}
