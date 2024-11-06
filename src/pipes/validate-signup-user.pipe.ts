import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UserSignupDto } from 'src/users/dto/user-signup';

@Injectable()
export class ValidateSignupUserPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: UserSignupDto, metadata: ArgumentMetadata) {
    const parsedDob = new Date(value.dob);
    if (isNaN(parsedDob.getTime())) {
      throw new BadRequestException('Invalid date of birth provided');
    }
    value.dob = parsedDob;
    return value;
  }
}
