import { PartialType } from '@nestjs/mapped-types';
import { CreateForumDto } from './create-forum.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateForumDto extends PartialType(CreateForumDto) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
}
