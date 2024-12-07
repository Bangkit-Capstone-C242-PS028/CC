import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { GamificationService } from './gamification.service';
import { ActivityLog } from './entities/activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ActivityLog])],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
