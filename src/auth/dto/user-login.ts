import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
