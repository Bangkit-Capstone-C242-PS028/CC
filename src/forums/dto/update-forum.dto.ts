import { PartialType } from '@nestjs/mapped-types';
import { CreateForumDto } from './create-forum.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateForumDto extends PartialType(CreateForumDto) {
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
