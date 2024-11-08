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
  FindAllArticlesParams,
  DeleteArticleParams,
} from 'src/utils/types';
import { Doctor } from 'src/users/entities/doctor.entity';

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

    return this.articleRepository.save(article);
  }

  async findAll(params: FindAllArticlesParams) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [articles, total] = await this.articleRepository.findAndCount({
      relations: { author: { user: true } },
      take: limit,
      skip,
      order: { created_at: 'DESC' },
    });

    return {
      data: articles,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
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
      title,
      content,
      updated_at: new Date(),
    });

    return this.articleRepository.findOne({
      where: { id },
      relations: { author: { user: true } },
    });
  }

  async remove(params: DeleteArticleParams) {
    const { id, authorUid } = params;

    const article = await this.articleRepository.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.author.uid !== authorUid) {
      throw new ForbiddenException(
        'You are not allowed to delete this article',
      );
    }

    await this.articleRepository.delete(id);
    return article;
  }
}
