import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateForumDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
