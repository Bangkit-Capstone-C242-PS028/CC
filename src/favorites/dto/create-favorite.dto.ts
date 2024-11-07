import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsNumber()
  @IsNotEmpty()
  articleId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
