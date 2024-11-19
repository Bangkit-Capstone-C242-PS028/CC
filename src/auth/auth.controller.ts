import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ValidateSignupUserPipe } from 'src/pipes/validate-signup-user.pipe';
import { UserSignupDto } from './dto/user-signup';
import { SignUpUserParams } from 'src/utils/types';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ResponseMessage('User created successfully')
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
    return this.authService.createUser(userDetail);
  }
}
