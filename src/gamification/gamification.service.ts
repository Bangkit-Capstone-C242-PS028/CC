import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from 'src/users/entities/user.entity';
import { AddPointsDto } from './dto/add-points.dto';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addPoints(addPointsDto: AddPointsDto) {
    const { userId, activity, points } = addPointsDto;

    const user = await this.userRepository.findOne({ where: { uid: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.points += points;
    await this.userRepository.save(user);

    const activityLog = this.activityLogRepository.create({
      user,
      activity,
      points,
    });
    await this.activityLogRepository.save(activityLog);

    return { userId: user.uid, points: user.points };
  }
}
