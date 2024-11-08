import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateForumParams,
  CreateForumReplyParams,
  DeleteForumParams,
  DeleteForumReplyParams,
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

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(ForumReply)
    private readonly forumReplyRepository: Repository<ForumReply>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async findReplies(forumId: number, page = 1, limit = 10) {
    const forum = await this.forumRepository.findOne({
      where: { id: forumId },
    });

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    const skip = (page - 1) * limit;

    return this.forumReplyRepository.find({
      where: { forum_id: forumId },
      take: limit,
      skip,
      order: { created_at: 'ASC' },
    });
  }

  async createReply(createReplyDetails: CreateForumReplyParams) {
    const { content, forumId, responderUid, responderRole } =
      createReplyDetails;

    const forum = await this.forumRepository.findOne({
      where: { id: forumId },
      relations: ['doctor'],
    });

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    // Find the user
    const user = await this.userRepository.findOne({
      where: { uid: responderUid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If doctor is replying, handle forum assignment
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
      forum_id: forumId,
      responder_role: responderRole,
      responder: user,
      forum,
    });

    return this.forumReplyRepository.save(reply);
  }

  async updateReply(updateReplyDetails: UpdateForumReplyParams) {
    const { forumId, replyId, content, userUid, userRole } = updateReplyDetails;

    const reply = await this.forumReplyRepository.findOne({
      where: { id: replyId, forum_id: forumId },
      relations: ['responder'],
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    // Check if user owns this reply
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

  async removeReply(deleteReplyDetails: DeleteForumReplyParams) {
    const { forumId, replyId, userUid, userRole } = deleteReplyDetails;

    const reply = await this.forumReplyRepository.findOne({
      where: { id: replyId, forum_id: forumId },
      relations: ['responder', 'forum'],
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    // Check if user owns this reply
    if (reply.responder.uid !== userUid || reply.responder_role !== userRole) {
      throw new ForbiddenException('You can only delete your own replies');
    }

    // If this was the only doctor reply, update forum status
    if (userRole === 'DOCTOR') {
      const doctorReplies = await this.forumReplyRepository.count({
        where: {
          forum_id: forumId,
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
    return reply;
  }
}
