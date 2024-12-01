import { Injectable } from '@nestjs/common';
import { VertexaiService } from 'src/infrastructure/vertexai/vertexai.service';

@Injectable()
export class GenaiService {
  constructor(private readonly genaiService: VertexaiService) {}

  async chat(message: string) {
    return this.genaiService.chat(message);
  }
}
