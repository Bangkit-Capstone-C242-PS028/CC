import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateForumParams,
  DeleteForumParams,
  UpdateForumParams,
} from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from './entities/forum.entity';
import { Patient } from 'src/users/entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createForumDetails: CreateForumParams) {
    const { title, content, patientUid } = createForumDetails;

    const patient = await this.patientRepository.findOne({
      where: { uid: patientUid },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const forum = this.forumRepository.create({
      title,
      content,
      patient,
    });

    return this.forumRepository.save(forum);
  }
  findAll(page: number = 1, limit: number = 10) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Invalid page or limit');
    }

    const skip = (page - 1) * limit;

    return this.forumRepository.find({
      take: limit,
      skip,
    });
  }

  async findOne(id: number) {
    const forum = await this.forumRepository.findOne({
      where: { id },
      relations: {
        patient: {
          user: true,
        },
        doctor: {
          user: true,
        },
        replies: true,
      },
    });
    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    return forum;
  }

  async update(updateForumDetails: UpdateForumParams) {
    const { id, title, content, patientUid } = updateForumDetails;

    const forum = await this.forumRepository.findOne({
      where: { id },
      relations: { patient: true },
    });

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    if (forum.patient.uid !== patientUid) {
      throw new ForbiddenException('You can only update your own forums');
    }

    if (forum.status !== 'open') {
      throw new ForbiddenException('You can only update open forums');
    }

    await this.forumRepository.update(id, {
      ...(title && { title }),
      ...(content && { content }),
      updated_at: new Date(),
    });

    return this.findOne(id);
  }

  async remove(deleteForumDetails: DeleteForumParams) {
    const { id, patientUid } = deleteForumDetails;

    const forum = await this.forumRepository.findOne({
      where: { id },
      relations: { patient: true },
    });

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    if (forum.patient.uid !== patientUid) {
      throw new ForbiddenException('You can only delete your own forums');
    }

    if (forum.status !== 'open') {
      throw new ForbiddenException('You can only delete open forums');
    }

    await this.forumRepository.delete(id);
    return forum;
  }
}
