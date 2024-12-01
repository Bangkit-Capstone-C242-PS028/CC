import { Module } from '@nestjs/common';
import { GenaiService } from './genai.service';
import { GenaiController } from './genai.controller';
import { VertexaiModule } from 'src/infrastructure/vertexai/vertexai.module';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';

@Module({
  imports: [VertexaiModule],
  controllers: [GenaiController],
  providers: [GenaiService, FirebaseAdmin],
})
export class GenaiModule {}
