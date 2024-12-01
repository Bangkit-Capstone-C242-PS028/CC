import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ValidateSignupUserPipe } from 'src/pipes/validate-signup-user.pipe';
import { UserSignupDto } from './dto/user-signup';
import { SignUpUserParams } from 'src/utils/types';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UseInterceptors(
    FileInterceptor('document', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('application/pdf')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  @ResponseMessage('User created successfully')
  signup(
    @Body(ValidateSignupUserPipe) userRequest: UserSignupDto,
    @UploadedFile() document: Express.Multer.File,
  ) {
    if (userRequest.password !== userRequest.confirmPassword) {
      throw new BadRequestException('Password does not match');
    }
    if (userRequest.role === 'DOCTOR' && !document) {
      throw new BadRequestException('Document is required');
    }
    if (userRequest.role === 'PATIENT' && document) {
      throw new BadRequestException('Document is not required');
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
      whatsappUrl: userRequest.whatsappUrl || null,
      document: document || null,
    };
    return this.authService.createUser(userDetail);
  }
}
