import { PartialType } from '@nestjs/mapped-types';
import { CreateSkinLesionDto } from './create-skin-lesion.dto';

export class UpdateSkinLesionDto extends PartialType(CreateSkinLesionDto) {}
