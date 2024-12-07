import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class AddPointsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  activity: string;

  @IsInt()
  @Min(1)
  points: number;
}
