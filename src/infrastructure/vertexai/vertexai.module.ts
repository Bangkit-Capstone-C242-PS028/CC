import { Module } from '@nestjs/common';
import { VertexaiService } from './vertexai.service';

@Module({
  providers: [VertexaiService],
  exports: [VertexaiService],
})
export class VertexaiModule {}
