import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateForumReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
