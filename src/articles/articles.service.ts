import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleParams, UpdateArticleParams } from 'src/utils/types';
import { FirebaseAdmin } from 'config/firebase.setup';
import { Doctor } from 'src/users/entities/doctor.entity';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly admin: FirebaseAdmin,

    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(articleDetails: CreateArticleParams, doctor_id: string) {
    const doctor = await this.doctorRepository.findOneBy({ uid: doctor_id });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const article = this.articleRepository.create({
      ...articleDetails,
      author: doctor,
    });
    return this.articleRepository.save(article);
  }

  async findAll(page = 1, limit = 10) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const skip = (page - 1) * limit;

    return this.articleRepository.find({
      skip,
      take: limit,
      relations: { author: true },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, includeAuthor = true) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: includeAuthor ? { author: true } : undefined,
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async update(
    id: number,
    articleDetails: UpdateArticleParams,
    doctor_id: string,
  ) {
    const doctor = await this.doctorRepository.findOneBy({ uid: doctor_id });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const article = await this.findOne(id);
    if (article.author.uid !== doctor_id) {
      throw new ForbiddenException(
        'You are not allowed to update this article',
      );
    }

    await this.articleRepository.update(id, { ...articleDetails });
    return article;
  }

  async remove(id: number, doctor_id: string) {
    const doctor = await this.doctorRepository.findOneBy({ uid: doctor_id });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const article = await this.findOne(id);
    if (article.author.uid !== doctor_id) {
      throw new ForbiddenException(
        'You are not allowed to delete this article',
      );
    }

    await this.articleRepository.delete(id);
    return article;
  }
}
