import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum } from './entities/forum.entity';
import { ForumReply } from './entities/forum-reply.entity';
import { FirebaseAdmin } from 'config/firebase.setup';
import { Patient } from 'src/users/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forum, ForumReply, Patient])],
  controllers: [ForumsController],
  providers: [ForumsService, FirebaseAdmin],
})
export class ForumsModule {}
