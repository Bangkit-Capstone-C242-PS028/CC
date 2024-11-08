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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Auth } from 'src/decorators/auth.decorator';
import {
  CreateArticleParams,
  UpdateArticleParams,
  FindArticleParams,
  DeleteArticleParams,
} from 'src/utils/types';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/utils/pagination.helper';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Auth('DOCTOR')
  async create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    const { uid } = req.user;
    const createArticleParams: CreateArticleParams = {
      title: createArticleDto.title,
      content: createArticleDto.content,
      authorUid: uid,
    };
    return this.articlesService.create(createArticleParams);
  }

  @Get()
  @Auth('DOCTOR', 'PATIENT')
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
  findOne(@Param('id') id: string) {
    const findArticleDetails: FindArticleParams = {
      id: +id,
    };
    return this.articlesService.findOne(findArticleDetails);
  }

  @Patch(':id')
  @Auth('DOCTOR')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ) {
    const { uid } = req.user;
    const updateArticleDetails: UpdateArticleParams = {
      id: +id,
      title: updateArticleDto.title,
      content: updateArticleDto.content,
      authorUid: uid,
    };
    return this.articlesService.update(updateArticleDetails);
  }

  @Delete(':id')
  @Auth('DOCTOR')
  remove(@Param('id') id: string, @Request() req) {
    const { uid } = req.user;
    const deleteArticleDetails: DeleteArticleParams = {
      id: +id,
      authorUid: uid,
    };
    return this.articlesService.remove(deleteArticleDetails);
  }
}
