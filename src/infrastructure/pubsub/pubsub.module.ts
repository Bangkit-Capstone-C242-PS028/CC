import { Module } from '@nestjs/common';
import { PubsubService } from './pubsub.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [PubsubService],
  exports: [PubsubService],
})
export class PubsubModule {}
