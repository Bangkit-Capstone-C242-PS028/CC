import {
  Controller,
  Body,
  Get,
  Query,
  Patch,
  Delete,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
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

  @Get('me')
  @Auth('PATIENT', 'DOCTOR')
  @ResponseMessage('User retrieved successfully')
  findMe(@Req() req) {
    const { uid } = req.user;
    const findUserDetails = {
      uid,
    };
    return this.usersService.findOne(findUserDetails);
  }

  @Patch('me')
  @Auth('PATIENT', 'DOCTOR')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1024 * 1024 * 1 },
    }),
  )
  @ResponseMessage('User updated successfully')
  updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const { uid, role } = req.user;
    const updateUserDetails: UpdateUserParams = {
      uid,
      ...updateUserDto,
      image,
    };

    // Only doctors can update specialization and workplace
    if (role !== 'DOCTOR') {
      delete updateUserDetails.specialization;
      delete updateUserDetails.workplace;
      delete updateUserDetails.phoneNumber;
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
    @Query('role') role?: string,
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
