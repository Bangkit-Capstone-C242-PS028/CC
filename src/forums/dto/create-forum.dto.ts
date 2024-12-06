import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateForumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
