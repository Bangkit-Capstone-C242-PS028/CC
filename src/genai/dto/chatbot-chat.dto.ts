import { IsNotEmpty, IsString } from 'class-validator';

export class ChatbotChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
