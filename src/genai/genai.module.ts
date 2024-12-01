import { Module } from '@nestjs/common';
import { GenaiService } from './genai.service';
import { GenaiController } from './genai.controller';
import { VertexaiModule } from 'src/infrastructure/vertexai/vertexai.module';

@Module({
  imports: [VertexaiModule],
  controllers: [GenaiController],
  providers: [GenaiService],
})
export class GenaiModule {}
