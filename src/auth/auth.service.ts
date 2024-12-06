import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from '../infrastructure/firebase/firebase.setup';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserParams } from 'src/utils/types';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { User } from '../users/entities/user.entity';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login';

@Injectable()
export class AuthService {
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

  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    const userDb = await this.userRepository.findOneBy({ email });
    if (!userDb) {
      throw new BadRequestException('User or password is incorrect');
    }
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, userDb.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('User or password is incorrect');
    }

    const app = this.firebaseAdmin.setup();
    const user = await app.auth().getUserByEmail(email);
    const token = await app.auth().createCustomToken(user.uid, {
      role: userDb.role,
    });
    return { token };
  }

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
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async insertUser(userRequest: SignUpUserParams, uid: string) {
    const { email, firstName, lastName, dob, address, role, password } =
      userRequest;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      uid,
      email,
      role,
      firstName,
      lastName,
      dob,
      address,
      password: hashedPassword,
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
    const { specialization, workplace, whatsappUrl, document } = userRequest;

    const fileName = `doctors-documents/${uid}`;
    const documentUrl = await this.storageService.save(
      fileName,
      document.mimetype,
      document.buffer,
      [{ id: uid }],
    );

    const newDoctor = this.doctorRepository.create({
      uid,
      user,
      specialization,
      workplace,
      whatsappUrl,
      documentUrl,
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
