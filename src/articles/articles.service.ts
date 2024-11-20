import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateArticleParams,
  UpdateArticleParams,
  FindArticleParams,
  DeleteArticleParams,
  PaginationParams,
  PaginatedResponse,
} from 'src/utils/types';
import { Doctor } from 'src/users/entities/doctor.entity';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  getPaginationParams,
} from 'src/utils/pagination.helper';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(params: CreateArticleParams) {
    const { title, content, authorUid } = params;

    const doctor = await this.doctorRepository.findOne({
      where: { uid: authorUid },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const article = this.articleRepository.create({
      title,
      content,
      author: doctor,
    });

    await this.articleRepository.save(article);
    return this.findOne({ id: article.id });
  }

  async findAll(params: PaginationParams): Promise<PaginatedResponse<Article>> {
    const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = params;
    const { skip, take } = getPaginationParams(page, limit);

    const [data, total] = await this.articleRepository.findAndCount({
      take,
      skip,
      relations: {
        author: {
          user: true,
        },
      },
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findOne(params: FindArticleParams) {
    const { id } = params;
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: { author: { user: true } },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async update(params: UpdateArticleParams) {
    const { id, title, content, authorUid } = params;

    const article = await this.articleRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.author.uid !== authorUid) {
      throw new ForbiddenException(
        'You are not allowed to update this article',
      );
    }

    await this.articleRepository.update(id, {
      ...(title && { title }),
      ...(content && { content }),
      updated_at: new Date(),
    });

    return this.findOne({ id });
  }

  async remove(params: DeleteArticleParams) {
    const { id, authorUid } = params;

    const article = await this.findOne({ id });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.author.uid !== authorUid) {
      throw new ForbiddenException(
        'You are not allowed to delete this article',
      );
    }

    await this.articleRepository.remove(article);
    return article;
  }
}
