import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}