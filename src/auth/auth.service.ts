import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from '../infrastructure/firebase/firebase.setup';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserParams } from 'src/utils/types';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    private readonly userService: UsersService,

    private readonly firebaseAdmin: FirebaseAdmin,
  ) {}

  async createUser(userRequest: SignUpUserParams): Promise<User> {
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
      return this.userService.findOne({ uid: createdUser.uid });
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
}
