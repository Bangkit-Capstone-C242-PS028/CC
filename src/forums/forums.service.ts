import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateForumParams,
  CreateForumReplyParams,
  DeleteForumParams,
  DeleteForumReplyParams,
  FindRepliesParams,
  PaginatedResponse,
  PaginationParams,
  UpdateForumParams,
  UpdateForumReplyParams,
} from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from './entities/forum.entity';
import { Patient } from 'src/users/entities/patient.entity';
import { Not, Repository } from 'typeorm';
import { Doctor } from 'src/users/entities/doctor.entity';
import { ForumReply } from './entities/forum-reply.entity';
import { User } from 'src/users/entities/user.entity';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  getPaginationParams,
} from 'src/utils/pagination.helper';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,
    @InjectRepository(ForumReply)
    private readonly forumReplyRepository: Repository<ForumReply>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
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

    await this.forumRepository.save(forum);
    return { forumId: forum.id };
  }

  async findAll(params: PaginationParams): Promise<PaginatedResponse<Forum>> {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { skip, take } = getPaginationParams(page, limit);

    const [data, total] = await this.forumRepository.findAndCount({
      take,
      skip,
      relations: {
        patient: {
          user: true,
        },
        doctor: {
          user: true,
        },
      },
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
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

  async findMyForums(patientUid: string) {
    const forums = await this.forumRepository.find({
      where: { patient: { uid: patientUid } },
    });
    return forums;
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

    try {
      if (forum.replies?.length > 0) {
        await this.forumReplyRepository.remove(forum.replies);
      }
      await this.forumRepository.delete(id);
    } catch (error) {
      console.log(error);
    }
  }

  async findReplies(
    params: FindRepliesParams,
  ): Promise<PaginatedResponse<ForumReply>> {
    const { forumId, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { skip, take } = getPaginationParams(page, limit);

    const forum = await this.forumRepository.findOne({
      where: { id: forumId },
    });

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const [data, total] = await this.forumReplyRepository.findAndCount({
      where: { forum: { id: forumId } },
      relations: ['responder'],
      take,
      skip,
      order: { created_at: 'ASC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async createReply(params: CreateForumReplyParams) {
    const { content, forumId, responderUid, responderRole } = params;

    const forum = await this.forumRepository.findOne({
      where: { id: forumId },
      relations: ['doctor'],
    });

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const user = await this.userRepository.findOne({
      where: { uid: responderUid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (responderRole === 'DOCTOR' && !forum.doctor) {
      const doctor = await this.doctorRepository.findOne({
        where: { uid: responderUid },
      });
      if (!doctor) throw new NotFoundException('Doctor not found');

      forum.doctor = doctor;
      forum.status = 'answered';
      await this.forumRepository.save(forum);
    }

    const reply = this.forumReplyRepository.create({
      content,
      responder_role: responderRole,
      responder: user,
      forum,
    });

    await this.forumReplyRepository.save(reply);
    return { replyId: reply.id };
  }

  async updateReply(params: UpdateForumReplyParams) {
    const { forumId, replyId, content, userUid, userRole } = params;

    const reply = await this.forumReplyRepository.findOne({
      where: { id: replyId, forum: { id: forumId } },
      relations: ['responder'],
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (reply.responder.uid !== userUid || reply.responder_role !== userRole) {
      throw new ForbiddenException('You can only update your own replies');
    }

    await this.forumReplyRepository.update(replyId, {
      content,
      updated_at: new Date(),
    });

    return this.forumReplyRepository.findOne({
      where: { id: replyId },
      relations: ['responder'],
    });
  }

  async removeReply(params: DeleteForumReplyParams) {
    const { forumId, replyId, userUid, userRole } = params;

    const reply = await this.forumReplyRepository.findOne({
      where: { id: replyId, forum: { id: forumId } },
      relations: ['responder', 'forum'],
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (reply.responder.uid !== userUid || reply.responder_role !== userRole) {
      throw new ForbiddenException('You can only delete your own replies');
    }

    if (userRole === 'DOCTOR') {
      const doctorReplies = await this.forumReplyRepository.count({
        where: {
          forum: { id: forumId },
          responder_role: 'DOCTOR',
          id: Not(replyId),
        },
      });

      if (doctorReplies === 0) {
        await this.forumRepository.update(forumId, {
          status: 'open',
          doctor: null,
        });
      }
    }

    await this.forumReplyRepository.remove(reply);
    return;
  }
}
