import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import {
  CreateArticleParams,
  UpdateArticleParams,
  FindArticleParams,
  DeleteArticleParams,
} from 'src/utils/types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/utils/pagination.helper';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Auth('DOCTOR')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1024 * 1024 * 1 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ResponseMessage('Article created successfully')
  async create(
    @Request() req,
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { uid } = req.user;
    if (!image) {
      throw new BadRequestException('Image is required');
    }
    const createArticleParams: CreateArticleParams = {
      title: createArticleDto.title,
      content: createArticleDto.content,
      authorUid: uid,
      image,
    };
    return this.articlesService.create(createArticleParams);
  }

  @Get()
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Articles retrieved successfully')
  async findAll(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page: number,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit: number,
  ) {
    return this.articlesService.findAll({ page, limit });
  }

  @Get(':id')
  @Auth('DOCTOR', 'PATIENT')
  @ResponseMessage('Article retrieved successfully')
  findOne(@Param('id') id: string) {
    const findArticleDetails: FindArticleParams = {
      id: id,
    };
    return this.articlesService.findOne(findArticleDetails);
  }

  @Patch(':id')
  @Auth('DOCTOR')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 1024 * 1024 * 1 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ResponseMessage('Article updated successfully')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const { uid } = req.user;
    const updateArticleDetails: UpdateArticleParams = {
      id: id,
      title: updateArticleDto.title,
      content: updateArticleDto.content,
      authorUid: uid,
      image,
    };
    return this.articlesService.update(updateArticleDetails);
  }

  @Delete(':id')
  @Auth('DOCTOR')
  @ResponseMessage('Article deleted successfully')
  remove(@Param('id') id: string, @Request() req) {
    const { uid } = req.user;
    const deleteArticleDetails: DeleteArticleParams = {
      id: id,
      authorUid: uid,
    };
    return this.articlesService.remove(deleteArticleDetails);
  }
}
