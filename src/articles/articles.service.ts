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
import { Favorite } from 'src/favorites/entities/favorite.entity';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { title } from 'process';
import { FirebaseAdmin } from 'src/infrastructure/firebase/firebase.setup';
import { GamificationService } from 'src/gamification/gamification.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly storageService: StorageService,
    private readonly firebaseAdmin: FirebaseAdmin,
    private readonly gamificationService: GamificationService,
  ) {}

  private async sendNewArticleNotification(article: Article) {
    const message = {
      notification: {
        title: 'New Article Published',
        body: `A new article titled "${article.title}" has been published.`,
        image: article.imageUrl,
      },
      topic: 'articles',
    };

    try {
      await this.firebaseAdmin.setup().messaging().send(message);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async create(params: CreateArticleParams) {
    const { title, content, authorUid, image } = params;
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

    const imageUrl = await this.storageService.save(
      `articles/${doctor.uid}/${article.id}`,
      image.mimetype,
      image.buffer,
      [{ id: article.id }],
    );

    await this.articleRepository.update(article.id, { imageUrl });

    await this.sendNewArticleNotification(article);
    await this.gamificationService.addPoints({
      userId: authorUid,
      activity: 'Create Article',
      points: 10,
    });
    return { articleId: article.id };
  }

  async findAll(params: PaginationParams) {
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
      articles: data.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        image_url: article.imageUrl,
        created_at: article.created_at,
        updated_at: article.updated_at,
        name:
          article.author.user.firstName + ' ' + article.author.user.lastName,
        avatar: article.author.user.photoUrl,
      })),
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

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      image_url: article.imageUrl,
      created_at: article.created_at,
      updated_at: article.updated_at,
      name: article.author.user.firstName + ' ' + article.author.user.lastName,
      avatar: article.author.user.photoUrl,
    };
  }

  async update(params: UpdateArticleParams) {
    const { id, title, content, authorUid, image } = params;

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

    let imageUrl;
    if (image) {
      await this.storageService.delete(`articles/${article.author.uid}/${id}`);
      imageUrl = await this.storageService.save(
        `articles/${article.author.uid}/${id}`,
        image.mimetype,
        image.buffer,
        [{ id }],
      );
    }

    await this.articleRepository.update(id, {
      ...(title && { title }),
      ...(content && { content }),
      ...(imageUrl && { imageUrl }),
      updated_at: new Date(),
    });

    return this.findOne({ id });
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

    await this.favoriteRepository.delete({ article: { id } });
    await this.articleRepository.remove(article);
  }
}
