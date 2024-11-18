import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage } from '@google-cloud/storage';
// import { PubSub } from '@google-cloud/pubsub';
import { SkinLesion, SkinLesionStatus } from './entities/skin-lesion.entity';
import {
  CreateSkinLesionParams,
  FindSkinLesionParams,
  FindAllSkinLesionsParams,
  UpdateSkinLesionParams,
  DeleteSkinLesionParams,
  PaginatedSkinLesionResponse,
} from 'src/utils/types';
import { getPaginationParams } from 'src/utils/pagination.helper';
import { StorageService } from 'src/storage/storage.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SkinLesionsService {
  private storage: Storage;
  // private pubsub: PubSub;
  private bucket: string;
  private topicName: string;

  constructor(
    @InjectRepository(SkinLesion)
    private skinLesionRepository: Repository<SkinLesion>,
    private storageService: StorageService,
  ) {}

  async create(params: CreateSkinLesionParams) {
    const { patientUid, image } = params;
    try {
      // 1. Upload to Cloud Storage
      const id = nanoid();
      const fileId = id;
      const publicUrl = await this.storageService.save(
        `skin-lesions/${patientUid}/${fileId}`,
        image.mimetype,
        image.buffer,
        [{ fileId }],
      );

      // 2. Save to database
      const skinLesion = await this.saveSkinLesion(id, patientUid, publicUrl);

      // 3. Publish to Pub/Sub
      // await this.publishToQueue(skinLesion);

      return skinLesion;
    } catch (error) {
      // If something fails, cleanup any uploaded files
      if (error.publicUrl) {
        await this.storageService.delete(error.publicUrl);
      }
      throw new Error(`Failed to create skin lesion: ${error.message}`);
    }
  }

  async findOne(params: FindSkinLesionParams) {
    const { id, patientUid } = params;
    const skinLesion = await this.skinLesionRepository.findOne({
      where: { id, patientUid },
    });

    if (!skinLesion) {
      throw new NotFoundException('Skin lesion not found');
    }

    return skinLesion;
  }

  async findAll(
    params: FindAllSkinLesionsParams,
  ): Promise<PaginatedSkinLesionResponse> {
    const { patientUid, page, limit } = params;
    const { skip, take } = getPaginationParams(page, limit);

    const [skinLesions, total] = await this.skinLesionRepository.findAndCount({
      where: { patientUid },
      order: { createdAt: 'DESC' },
      take,
      skip,
    });

    const data = skinLesions.map((lesion) => ({
      id: lesion.id,
      originalImageUrl: lesion.originalImageUrl,
      processedImageUrl: lesion.processedImageUrl,
      classification: lesion.classification,
      severity: lesion.severity,
      status: lesion.status,
      createdAt: lesion.createdAt,
      processedAt: lesion.processedAt,
    }));

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async updateClassification(params: UpdateSkinLesionParams) {
    const { id, classification, severity, processedImageUrl } = params;
    const skinLesion = await this.skinLesionRepository.findOne({
      where: { id },
    });

    if (!skinLesion) {
      throw new NotFoundException('Skin lesion not found');
    }

    try {
      skinLesion.classification = classification;
      skinLesion.severity = severity;
      skinLesion.processedImageUrl = processedImageUrl;
      skinLesion.status = SkinLesionStatus.COMPLETED;
      skinLesion.processedAt = new Date();

      return await this.skinLesionRepository.save(skinLesion);
    } catch (error) {
      throw new Error(`Failed to update classification: ${error.message}`);
    }
  }

  async remove(params: DeleteSkinLesionParams) {
    const { id, patientUid } = params;
    const skinLesion = await this.skinLesionRepository.findOne({
      where: { id, patientUid },
    });

    if (!skinLesion) {
      throw new NotFoundException('Skin lesion not found');
    }

    if (patientUid !== skinLesion.patientUid) {
      throw new ForbiddenException(
        'You are not authorized to delete this skin lesion',
      );
    }

    try {
      // Delete images from Cloud Storage
      if (skinLesion.originalImageUrl) {
        const fileName = skinLesion.originalImageUrl
          .split('/')
          .pop()
          .replaceAll('%2F', '/');
        await this.storageService.delete(fileName);
      }
      if (skinLesion.processedImageUrl) {
        const processedFileName = skinLesion.processedImageUrl
          .split('/')
          .pop()
          .replaceAll('%2F', '/');
        await this.storageService.delete(processedFileName);
      }
      // Remove from database
      await this.skinLesionRepository.remove(skinLesion);
      return { message: 'Skin lesion deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete skin lesion: ${error.message}`);
    }
  }

  private async saveSkinLesion(
    id: string,
    patientUid: string,
    imageUrl: string,
  ): Promise<SkinLesion> {
    const skinLesion = this.skinLesionRepository.create({
      id,
      patientUid,
      originalImageUrl: imageUrl,
      status: SkinLesionStatus.PENDING,
    });

    try {
      return await this.skinLesionRepository.save(skinLesion);
    } catch (error) {
      // Add publicUrl to error for cleanup
      error.publicUrl = imageUrl;
      throw error;
    }
  }
}
