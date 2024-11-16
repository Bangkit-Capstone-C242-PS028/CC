import {
  Controller,
  Body,
  Get,
  Query,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import {
  FindUserParams,
  FindAllUsersParams,
  UpdateUserParams,
  DeleteUserParams,
} from 'src/utils/types';
import { UsersService } from './users.service';
import { Auth } from 'src/decorators/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Auth('PATIENT', 'DOCTOR')
  findMe(@Req() req) {
    const { uid } = req.user;
    const findUserParams: FindUserParams = {
      uid,
    };

    return this.usersService.findOne(findUserParams);
  }

  @Patch('me')
  @Auth('PATIENT', 'DOCTOR')
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
  removeMe(@Req() req) {
    const { uid } = req.user;
    const deleteUserParams: DeleteUserParams = {
      uid,
    };
    return this.usersService.remove(deleteUserParams);
  }

  @Get()
  @Auth('DOCTOR', 'PATIENT')
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
