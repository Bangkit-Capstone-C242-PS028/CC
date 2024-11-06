import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup';
import { SignUpUserParams } from 'src/utils/types';
import { ValidateSignupUserPipe } from 'src/pipes/validate-signup-user.pipe';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signup(@Body(ValidateSignupUserPipe) userRequest: UserSignupDto) {
    if (userRequest.password !== userRequest.confirmPassword) {
      throw new BadRequestException('Password does not match');
    }
    const userDetail: SignUpUserParams = {
      email: userRequest.email,
      password: userRequest.password,
      role: userRequest.role,
      firstName: userRequest.firstName,
      lastName: userRequest.lastName,
      dob: userRequest.dob,
      address: userRequest.address,
      specialization: userRequest.specialization || null,
      workplace: userRequest.workplace || null,
    };
    return this.usersService.createUser(userDetail);
  }
}
