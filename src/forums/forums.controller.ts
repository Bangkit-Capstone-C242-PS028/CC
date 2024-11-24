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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
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
import { FindRepliesParams } from 'src/utils/types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/utils/pagination.helper';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  @Auth('PATIENT')
  @ResponseMessage('Forum created successfully')
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
  @ResponseMessage('Forums retrieved successfully')
  findAll(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit: number,
  ) {
    return this.forumsService.findAll({ page, limit });
  }

  @Get(':id')
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Forum retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.forumsService.findOne(id);
  }

  @Patch(':id')
  @Auth('PATIENT')
  @ResponseMessage('Forum updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateForumDto: UpdateForumDto,
    @Req() req,
  ) {
    const { uid } = req.user;

    const updateForumDetails: UpdateForumParams = {
      id: id,
      ...updateForumDto,
      patientUid: uid,
    };
    return this.forumsService.update(updateForumDetails);
  }

  @Delete(':id')
  @Auth('PATIENT')
  @ResponseMessage('Forum deleted successfully')
  remove(@Param('id') id: string, @Req() req) {
    const { uid } = req.user;

    const deleteForumDetails: DeleteForumParams = {
      id: id,
      patientUid: uid,
    };
    return this.forumsService.remove(deleteForumDetails);
  }

  @Get(':forumId/replies')
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Forum replies retrieved successfully')
  findReplies(
    @Param('forumId') forumId: string,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit: number,
  ) {
    const findRepliesParams: FindRepliesParams = {
      forumId: forumId,
      page,
      limit,
    };
    return this.forumsService.findReplies(findRepliesParams);
  }

  @Post(':forumId/replies')
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Forum reply created successfully')
  createReply(
    @Param('forumId') forumId: string,
    @Body() createReplyDto: CreateForumReplyDto,
    @Req() req,
  ) {
    const { uid, role } = req.user;
    const createReplyParams: CreateForumReplyParams = {
      content: createReplyDto.content,
      forumId: forumId,
      responderUid: uid,
      responderRole: role,
    };
    return this.forumsService.createReply(createReplyParams);
  }

  @Patch(':forumId/replies/:replyId')
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Forum reply updated successfully')
  updateReply(
    @Param('forumId') forumId: string,
    @Param('replyId') replyId: string,
    @Body() updateReplyDto: UpdateForumReplyDto,
    @Req() req,
  ) {
    const { uid, role } = req.user;
    const updateReplyParams: UpdateForumReplyParams = {
      forumId: forumId,
      replyId: replyId,
      content: updateReplyDto.content,
      userUid: uid,
      userRole: role,
    };
    return this.forumsService.updateReply(updateReplyParams);
  }

  @Delete(':forumId/replies/:replyId')
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Forum reply deleted successfully')
  removeReply(
    @Param('forumId') forumId: string,
    @Param('replyId') replyId: string,
    @Req() req,
  ) {
    const { uid, role } = req.user;
    const deleteReplyParams: DeleteForumReplyParams = {
      forumId: forumId,
      replyId: replyId,
      userUid: uid,
      userRole: role,
    };
    return this.forumsService.removeReply(deleteReplyParams);
  }
}
