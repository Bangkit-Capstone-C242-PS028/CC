import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateForumReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
