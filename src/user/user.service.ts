import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseAdmin } from '../../config/firebase.setup';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserParams } from 'src/utils/types';

@Injectable()
export class UserService {
  constructor(
    private readonly admin: FirebaseAdmin,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userRequest: SignUpUserParams): Promise<any> {
    const { email, password, firstName, lastName, role, dob, address } =
      userRequest;
    const app = this.admin.setup();
    try {
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      await app.auth().setCustomUserClaims(createdUser.uid, { role });

      const newUser = this.userRepository.create({
        uid: createdUser.uid,
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

      return createdUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
