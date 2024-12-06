import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateForumReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
