import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkinLesion, SkinLesionStatus } from './entities/skin-lesion.entity';
import {
  CreateSkinLesionParams,
  FindSkinLesionParams,
  FindAllSkinLesionsParams,
  DeleteSkinLesionParams,
  PaginatedSkinLesionResponse,
} from 'src/utils/types';
import { getPaginationParams } from 'src/utils/pagination.helper';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { nanoid } from 'nanoid';
import { PubsubService } from 'src/infrastructure/pubsub/pubsub.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SkinLesionsService {
  constructor(
    @InjectRepository(SkinLesion)
    private skinLesionRepository: Repository<SkinLesion>,
    private storageService: StorageService,
    private pubsubService: PubsubService,
    private usersService: UsersService,
  ) {}

  async create(params: CreateSkinLesionParams) {
    const { patientUid, image } = params;

    const patient = await this.usersService.findOne({ uid: patientUid });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    try {
      // 1. Upload to Cloud Storage
      const id = nanoid();
      const fileName = `skin-lesions/${patientUid}/${id}`;
      const publicUrl = await this.storageService.save(
        fileName,
        image.mimetype,
        image.buffer,
        [{ id }],
      );
      // 2. Save to database
      const skinLesion = await this.saveSkinLesion(
        id,
        patient,
        publicUrl.replaceAll('%2F', '/'),
      );

      // 3. Publish to Pub/Sub
      await this.pubsubService.publish('skin-lesion-created', {
        id: skinLesion.id,
        patientUid: skinLesion.patient.uid,
        fileName,
        createdAt: skinLesion.createdAt,
      });
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
      where: { id, patient: { uid: patientUid } },
      relations: { patient: true },
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
      where: { patient: { uid: patientUid } },
      order: { createdAt: 'DESC' },
      relations: { patient: true },
      take,
      skip,
    });

    const data = skinLesions.map((lesion) => ({
      id: lesion.id,
      patientUid: lesion.patient.uid,
      originalImageUrl: lesion.originalImageUrl,
      processedImageUrl: lesion.processedImageUrl,
      classification: lesion.classification,
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

  async remove(params: DeleteSkinLesionParams) {
    const { id, patientUid } = params;
    const skinLesion = await this.skinLesionRepository.findOne({
      relations: { patient: true },
      where: { id, patient: { uid: patientUid } },
    });

    if (!skinLesion) {
      throw new NotFoundException('Skin lesion not found');
    }

    if (patientUid !== skinLesion.patient.uid) {
      throw new ForbiddenException(
        'You are not authorized to delete this skin lesion',
      );
    }
    if (skinLesion.originalImageUrl) {
      const fileName = skinLesion.originalImageUrl
        .split('storage.googleapis.com/dermascan-skin-lesions/')
        .pop();
      if (fileName) {
        await this.storageService.delete(fileName);
      }
    }
    if (skinLesion.processedImageUrl) {
      const processedFileName = skinLesion.processedImageUrl
        .split('storage.googleapis.com/dermascan-skin-lesions/')
        .pop();
      if (processedFileName) {
        await this.storageService.delete(processedFileName);
      }
    }

    await this.skinLesionRepository.delete({ id: skinLesion.id });
  }

  private async saveSkinLesion(
    id: string,
    patient: User,
    imageUrl: string,
  ): Promise<SkinLesion> {
    const skinLesion = this.skinLesionRepository.create({
      id,
      patient,
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
