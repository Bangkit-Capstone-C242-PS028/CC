import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from '../../config/firebase.setup';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserParams } from 'src/utils/types';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { Patient } from 'src/typeorm/entities/Patient';

@Injectable()
export class UserService {
  constructor(
    private readonly admin: FirebaseAdmin,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async createUser(userRequest: SignUpUserParams): Promise<any> {
    const { email, password, firstName, lastName, role } = userRequest;
    const app = this.admin.setup();
    try {
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      await app.auth().setCustomUserClaims(createdUser.uid, { role });

      if (role === 'DOCTOR') {
        await this.insertDoctor(userRequest, createdUser.uid);
      } else if (role === 'PATIENT') {
        await this.insertPatient(userRequest, createdUser.uid);
      }

      return createdUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async insertDoctor(userRequest: SignUpUserParams, uid: string) {
    const {
      email,
      firstName,
      lastName,
      dob,
      address,
      specialization,
      workplace,
    } = userRequest;
    console.log(userRequest);
    const newUser = this.doctorRepository.create({
      uid,
      email,
      firstName,
      lastName,
      dob,
      address,
      specialization,
      workplace,
      createdAt: new Date(),
      updatedAt: new Date(),
      points: 0,
    });
    await this.doctorRepository.save(newUser);
  }

  private async insertPatient(userRequest: SignUpUserParams, uid: string) {
    const { email, firstName, lastName, dob, address } = userRequest;
    const newUser = this.patientRepository.create({
      uid,
      email,
      firstName,
      lastName,
      dob,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
      points: 0,
    });
    await this.patientRepository.save(newUser);
  }
}
