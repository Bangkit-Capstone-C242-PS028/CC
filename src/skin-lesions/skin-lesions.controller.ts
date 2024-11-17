import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Req,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkinLesionsService } from './skin-lesions.service';
import { Auth } from 'src/decorators/auth.decorator';
import {
  FindSkinLesionParams,
  DeleteSkinLesionParams,
  FindAllSkinLesionsParams,
  CreateSkinLesionParams,
} from 'src/utils/types';

@Controller('skin-lesions')
export class SkinLesionsController {
  constructor(private readonly skinLesionsService: SkinLesionsService) {}

  @Post()
  @Auth('PATIENT')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const { uid } = req.user;
    const createSkinLesionDetails: CreateSkinLesionParams = {
      patientUid: uid,
      image: file,
    };
    return this.skinLesionsService.create(createSkinLesionDetails);
  }

  @Get('me')
  @Auth('PATIENT')
  async findMyLesions(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const { uid } = req.user;
    const findAllSkinLesionsDetails: FindAllSkinLesionsParams = {
      patientUid: uid,
      page,
      limit,
    };
    return this.skinLesionsService.findAll(findAllSkinLesionsDetails);
  }

  @Get(':id')
  @Auth('PATIENT')
  async findOne(@Param('id') id: string, @Req() req) {
    const { uid } = req.user;
    const findSkinLesionDetails: FindSkinLesionParams = {
      id,
      patientUid: uid,
    };
    return this.skinLesionsService.findOne(findSkinLesionDetails);
  }

  @Delete(':id')
  @Auth('PATIENT')
  async remove(@Param('id') id: string, @Req() req) {
    const { uid } = req.user;
    const deleteSkinLesionDetails: DeleteSkinLesionParams = {
      id,
      patientUid: uid,
    };
    console.log(deleteSkinLesionDetails);
    return this.skinLesionsService.remove(deleteSkinLesionDetails);
  }
}
