import { Module } from '@nestjs/common';
import { ForumsService } from './forums.service';
import { ForumsController } from './forums.controller';
import { Doctor } from 'src/users/entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum } from './entities/forum.entity';
import { ForumReply } from './entities/forum-reply.entity';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';
import { Patient } from 'src/users/entities/patient.entity';
import { User } from 'src/users/entities/user.entity';
import { GamificationModule } from 'src/gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Forum, ForumReply, Patient, Doctor, User]),
    GamificationModule,
  ],
  controllers: [ForumsController],
  providers: [ForumsService, FirebaseAdmin],
})
export class ForumsModule {}
