import { PartialType } from '@nestjs/mapped-types';
import { CreateForumDto } from './create-forum.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateForumDto extends PartialType(CreateForumDto) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
