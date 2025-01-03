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
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { nanoid } from 'nanoid';

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
    private readonly storageService: StorageService,
  ) {}

  async findAll(params: FindAllUsersParams) {
    const { role, page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { skip, take } = getPaginationParams(page, limit);

    // const queryBuilder = this.userRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.doctor', 'doctor')
    //   .leftJoinAndSelect('user.patient', 'patient')

    // if (role) {
    //   queryBuilder.where('user.role = :role', { role });
    // }

    // const [data, total] = await queryBuilder
    //   .take(take)
    //   .skip(skip)
    //   .getManyAndCount();

    const [data, total] = await this.userRepository.findAndCount({
      where: role ? { role } : {},
      relations: ['doctor', 'patient'],
      order: { firstName: 'ASC', lastName: 'ASC' },
      take,
      skip,
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
    const {
      uid,
      image,
      specialization,
      workplace,
      phoneNumber,
      ...updateData
    } = params;
    const user = await this.findOne({ uid });

    await this.userRepository.update(uid, {
      ...updateData,
      updatedAt: new Date(),
    });
    if (
      user.role === 'DOCTOR' &&
      (specialization || workplace || phoneNumber)
    ) {
      await this.doctorRepository.update(
        { uid },
        {
          specialization,
          workplace,
          phoneNumber,
        },
      );
    }
    if (image) {
      if (user.photoUrl) {
        const oldFileName = user.photoUrl
          .split('https://storage.googleapis.com/dermascan-cloud-storage/')
          .pop();
        await this.storageService.delete(oldFileName);
      }

      const photoUrl = await this.storageService.save(
        `users/${uid}/profile/${nanoid()}`,
        image.mimetype,
        image.buffer,
        [{ id: uid }],
      );
      await this.userRepository.update(
        { uid },
        {
          photoUrl: photoUrl.replaceAll('%2F', '/'),
        },
      );
    }

    return this.findOne({ uid });
  }

  async remove(params: DeleteUserParams) {
    const { uid } = params;
    const user = await this.findOne({ uid });
    await this.firebaseAdmin.setup().auth().deleteUser(uid);

    await this.userRepository.delete(uid);
    if (user.role === 'DOCTOR') {
      await this.doctorRepository.delete({ uid });
    } else {
      await this.patientRepository.delete({ uid });
    }
  }
}
