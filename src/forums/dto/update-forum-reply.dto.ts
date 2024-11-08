import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateForumReplyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  content: string;
}
