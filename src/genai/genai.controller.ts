import { Body, Controller, Post } from '@nestjs/common';
import { GenaiService } from './genai.service';
import { ChatbotChatDto } from './dto/chatbot-chat.dto';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('genai')
export class GenaiController {
  constructor(private readonly genaiService: GenaiService) {}

  @Post('chatbot')
  @Auth('DOCTOR', 'PATIENT')
  async chatbot(@Body() chatbotChatDto: ChatbotChatDto) {
    return this.genaiService.chat(chatbotChatDto.message);
  }

  @Post('rephrase')
  @Auth('PATIENT')
  async rephrase(@Body() chatbotChatDto: ChatbotChatDto) {
    return this.genaiService.rephrase(chatbotChatDto.message);
  }
}
