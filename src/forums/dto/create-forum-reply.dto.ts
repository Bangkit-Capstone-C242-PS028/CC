import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateForumReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
