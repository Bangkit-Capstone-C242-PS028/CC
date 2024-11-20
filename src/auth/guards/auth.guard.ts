import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseAdmin } from '../../infrastructure/firebase/firebase.setup';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly admin: FirebaseAdmin,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const app = this.admin.setup();
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    try {
      const decodedToken = await app.auth().verifyIdToken(token);

      if (permissions.includes(decodedToken.role)) {
        request.user = decodedToken;
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      console.log('Error', error);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
