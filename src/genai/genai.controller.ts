import { Body, Controller, Post } from '@nestjs/common';
import { GenaiService } from './genai.service';
import { ChatbotChatDto } from './dto/chatbot-chat.dto';

@Controller('genai')
export class GenaiController {
  constructor(private readonly genaiService: GenaiService) {}
  @Post('chatbot')
  async chatbot(@Body() chatbotChatDto: ChatbotChatDto) {
    return this.genaiService.chat(chatbotChatDto.message);
  }

  @Post('rephrase')
  async rephrase(@Body() chatbotChatDto: ChatbotChatDto) {
    return this.genaiService.rephrase(chatbotChatDto.message);
  }
}
