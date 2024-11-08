import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseAdmin } from '../../config/firebase.setup';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SignUpUserParams,
  FindUserParams,
  FindAllUsersParams,
  UpdateUserParams,
  DeleteUserParams,
} from 'src/utils/types';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { User } from './entities/user.entity';

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

  async createUser(userRequest: SignUpUserParams): Promise<any> {
    const { email, password, firstName, lastName, role } = userRequest;
    const app = this.firebaseAdmin.setup();
    try {
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      await app.auth().setCustomUserClaims(createdUser.uid, { role });

      await this.insertUser(userRequest, createdUser.uid);
      return this.findOne({ uid: createdUser.uid });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async insertUser(userRequest: SignUpUserParams, uid: string) {
    const { email, firstName, lastName, dob, address, role } = userRequest;
    const newUser = this.userRepository.create({
      uid,
      email,
      role,
      firstName,
      lastName,
      dob,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
      points: 0,
    });
    await this.userRepository.save(newUser);

    if (role === 'DOCTOR') {
      await this.insertDoctor(userRequest, uid, newUser);
    } else if (role === 'PATIENT') {
      await this.insertPatient(userRequest, uid, newUser);
    }
  }

  private async insertDoctor(
    userRequest: SignUpUserParams,
    uid: string,
    user: User,
  ) {
    const { specialization, workplace } = userRequest;
    const newDoctor = this.doctorRepository.create({
      uid,
      user,
      specialization,
      workplace,
    });
    await this.doctorRepository.save(newDoctor);

    user.doctor = newDoctor;
    await this.userRepository.save(user);
  }

  private async insertPatient(
    userRequest: SignUpUserParams,
    uid: string,
    user: User,
  ) {
    const newPatient = this.patientRepository.create({
      uid,
      user,
    });
    await this.patientRepository.save(newPatient);

    user.patient = newPatient;
    await this.userRepository.save(user);
  }

  async findAll(params: FindAllUsersParams) {
    const { role, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.doctor', 'doctor')
      .leftJoinAndSelect('user.patient', 'patient');

    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }

    const [users, total] = await queryBuilder
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      data: users,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
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
    const user = await this.findOne({ uid });

    await this.firebaseAdmin.setup().auth().deleteUser(uid);
    await this.userRepository.remove(user);

    return user;
  }
}
