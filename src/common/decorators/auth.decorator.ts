import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';

export function Auth(...permissions: string[]) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthGuard),
  );
}
