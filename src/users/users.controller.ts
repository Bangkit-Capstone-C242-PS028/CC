import {
  Controller,
  Body,
  Get,
  Query,
  Patch,
  Delete,
  Req,
  Post,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import {
  FindUserParams,
  FindAllUsersParams,
  UpdateUserParams,
  DeleteUserParams,
} from 'src/utils/types';
import { UsersService } from './users.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('doctors/document')
  @Auth('DOCTOR')
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
  @ResponseMessage('Doctor document uploaded successfully')
  uploadDocument(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('Document is required');
    }
    const { uid } = req.user;
    return this.usersService.uploadDoctorDocument(uid, file);
  }

  @Get('me')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('User retrieved successfully')
  findMe(@Req() req) {
    const { uid } = req.user;
    const findUserParams: FindUserParams = {
      uid,
    };

    return this.usersService.findOne(findUserParams);
  }

  @Patch('me')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('User updated successfully')
  updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const { uid, role } = req.user;
    const updateUserDetails: UpdateUserParams = {
      uid,
      ...updateUserDto,
    };

    // Only doctors can update specialization and workplace
    if (role !== 'DOCTOR') {
      delete updateUserDetails.specialization;
      delete updateUserDetails.workplace;
    }
    return this.usersService.update(updateUserDetails);
  }

  @Delete('me')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('User deleted successfully')
  removeMe(@Req() req) {
    const { uid } = req.user;
    const deleteUserParams: DeleteUserParams = {
      uid,
    };
    return this.usersService.remove(deleteUserParams);
  }

  @Get()
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Users retrieved successfully')
  findAll(
    @Query('role') role: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const findAllUsersDetails: FindAllUsersParams = {
      role,
      page,
      limit,
    };

    return this.usersService.findAll(findAllUsersDetails);
  }
}
