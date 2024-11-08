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
  CreateForumReplyParams,
  DeleteForumParams,
  DeleteForumReplyParams,
  UpdateForumParams,
  UpdateForumReplyParams,
} from 'src/utils/types';
import { CreateForumReplyDto } from './dto/create-forum-reply.dto';
import { UpdateForumReplyDto } from './dto/update-forum-reply.dto';

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

  @Get(':forumId/replies')
  @Auth('DOCTOR', 'PATIENT')
  getReplies(
    @Param('forumId') forumId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.forumsService.findReplies(+forumId, page, limit);
  }

  @Post(':forumId/replies')
  @Auth('DOCTOR', 'PATIENT')
  createReply(
    @Param('forumId') forumId: string,
    @Body() createReplyDto: CreateForumReplyDto,
    @Req() req,
  ) {
    const { uid, role } = req.user;
    const createReplyDetails: CreateForumReplyParams = {
      content: createReplyDto.content,
      forumId: +forumId,
      responderUid: uid,
      responderRole: role,
    };
    return this.forumsService.createReply(createReplyDetails);
  }

  @Patch(':forumId/replies/:replyId')
  @Auth('DOCTOR', 'PATIENT')
  updateReply(
    @Param('forumId') forumId: string,
    @Param('replyId') replyId: string,
    @Body() updateReplyDto: UpdateForumReplyDto,
    @Req() req,
  ) {
    const { uid, role } = req.user;
    const updateReplyDetails: UpdateForumReplyParams = {
      forumId: +forumId,
      replyId: +replyId,
      content: updateReplyDto.content,
      userUid: uid,
      userRole: role,
    };
    return this.forumsService.updateReply(updateReplyDetails);
  }

  @Delete(':forumId/replies/:replyId')
  @Auth('DOCTOR', 'PATIENT')
  removeReply(
    @Param('forumId') forumId: string,
    @Param('replyId') replyId: string,
    @Req() req,
  ) {
    const { uid, role } = req.user;
    const deleteReplyDetails: DeleteForumReplyParams = {
      forumId: +forumId,
      replyId: +replyId,
      userUid: uid,
      userRole: role,
    };
    return this.forumsService.removeReply(deleteReplyDetails);
  }
}
