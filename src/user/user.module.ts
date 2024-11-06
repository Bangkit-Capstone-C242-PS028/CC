import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'config/firebase.setup';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/typeorm/entities/User';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, FirebaseAdmin],
})
export class UserModule {}
