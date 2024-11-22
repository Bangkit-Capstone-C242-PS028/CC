import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateForumDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  content: string;
}
