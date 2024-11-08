import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { Auth } from 'src/decorators/auth.decorator';
import {
  CreateForumParams,
  DeleteForumParams,
  UpdateForumParams,
} from 'src/utils/types';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  @Auth('PATIENT')
  create(@Body() createForumDto: CreateForumDto, @Req() req) {
    const { uid } = req.user;
    const createForumDetails: CreateForumParams = {
      ...createForumDto,
      patientUid: uid,
    };
    return this.forumsService.create(createForumDetails);
  }

  @Get()
  @Auth('DOCTOR', 'PATIENT')
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.forumsService.findAll(page, limit);
  }

  @Get(':id')
  @Auth('DOCTOR', 'PATIENT')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(+id);
  }

  @Patch(':id')
  @Auth('PATIENT')
  update(
    @Param('id') id: string,
    @Body() updateForumDto: UpdateForumDto,
    @Req() req,
  ) {
    const { uid } = req.user;

    const updateForumDetails: UpdateForumParams = {
      id: +id,
      ...updateForumDto,
      patientUid: uid,
    };
    return this.forumsService.update(updateForumDetails);
  }

  @Delete(':id')
  @Auth('PATIENT')
  remove(@Param('id') id: string, @Req() req) {
    const { uid } = req.user;

    const deleteForumDetails: DeleteForumParams = {
      id: +id,
      patientUid: uid,
    };
    return this.forumsService.remove(deleteForumDetails);
  }
}
