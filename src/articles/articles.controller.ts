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
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Auth('DOCTOR')
  async create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    const { uid } = req.user;
    return this.articlesService.create(createArticleDto, uid);
  }

  @Get()
  @Auth('DOCTOR', 'PATIENT')
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.articlesService.findAll(page, limit);
  }

  @Get(':id')
  @Auth('DOCTOR', 'PATIENT')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @Auth('DOCTOR')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req,
  ) {
    const { uid } = req.user;
    return this.articlesService.update(+id, updateArticleDto, uid);
  }

  @Delete(':id')
  @Auth('DOCTOR')
  remove(@Param('id') id: string, @Request() req) {
    const { uid } = req.user;
    return this.articlesService.remove(+id, uid);
  }
}
