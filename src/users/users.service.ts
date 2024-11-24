import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindUserParams,
  FindAllUsersParams,
  UpdateUserParams,
  DeleteUserParams,
} from 'src/utils/types';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { User } from './entities/user.entity';
import { DEFAULT_PAGE, getPaginationParams } from 'src/utils/pagination.helper';
import { DEFAULT_LIMIT } from 'src/utils/pagination.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    private readonly firebaseAdmin: FirebaseAdmin,
  ) {}

  async findAll(params: FindAllUsersParams) {
    const { role, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { skip, take } = getPaginationParams(page, limit);

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.doctor', 'doctor')
      .leftJoinAndSelect('user.patient', 'patient');

    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    const [data, total] = await queryBuilder
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findOne(params: FindUserParams) {
    const { uid } = params;
    const user = await this.userRepository.findOne({
      where: { uid },
      relations: ['doctor', 'patient'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(params: UpdateUserParams) {
    const { uid, ...updateData } = params;
    const user = await this.findOne({ uid });

    await this.userRepository.update(uid, {
      ...updateData,
      updatedAt: new Date(),
    });

    if (
      user.role === 'DOCTOR' &&
      (updateData.specialization || updateData.workplace)
    ) {
      await this.doctorRepository.update(
        { uid },
        {
          specialization: updateData.specialization,
          workplace: updateData.workplace,
        },
      );
    }

    return this.findOne({ uid });
  }

  async remove(params: DeleteUserParams) {
    const { uid } = params;
    await this.firebaseAdmin.setup().auth().deleteUser(uid);
    await this.userRepository.delete(uid);
  }
}
