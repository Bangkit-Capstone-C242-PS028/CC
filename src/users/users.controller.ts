import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UserSignupDto } from './dto/user-signup';
import {
  SignUpUserParams,
  FindUserParams,
  FindAllUsersParams,
  UpdateUserParams,
  DeleteUserParams,
} from 'src/utils/types';
import { ValidateSignupUserPipe } from 'src/pipes/validate-signup-user.pipe';
import { UsersService } from './users.service';
import { Auth } from 'src/decorators/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Get()
  @Auth('DOCTOR', 'PATIENT')
  findAll(
    @Query('role') role?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const params: FindAllUsersParams = {
      role,
      page,
      limit,
    };
    return this.usersService.findAll(params);
  }

  @Get(':uid')
  @Auth('DOCTOR', 'PATIENT')
  findOne(@Param('uid') uid: string) {
    const params: FindUserParams = { uid };
    return this.usersService.findOne(params);
  }

  @Patch(':uid')
  @Auth('DOCTOR', 'PATIENT')
  async update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    const { uid: requestUserUid } = req.user;

    // Check if user is updating their own profile
    if (requestUserUid !== uid) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const updateParams: UpdateUserParams = {
      uid,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      address: updateUserDto.address,
      specialization: updateUserDto.specialization,
      workplace: updateUserDto.workplace,
    };
    return this.usersService.update(updateParams);
  }

  @Delete(':uid')
  @Auth('DOCTOR', 'PATIENT')
  async remove(@Param('uid') uid: string, @Req() req) {
    const { uid: requestUserUid } = req.user;

    // Check if user is deleting their own account
    if (requestUserUid !== uid) {
      throw new ForbiddenException('You can only delete your own account');
    }

    const deleteParams: DeleteUserParams = { uid };
    return this.usersService.remove(deleteParams);
  }
}
