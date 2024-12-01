import { Injectable } from '@nestjs/common';
import { VertexaiService } from 'src/infrastructure/vertexai/vertexai.service';

@Injectable()
export class GenaiService {
  constructor(private readonly vertexaiService: VertexaiService) {}

  async chat(message: string) {
    return this.vertexaiService.chat(message);
  }

  async rephrase(text: string) {
    return this.vertexaiService.rephrase(text);
  }
}
