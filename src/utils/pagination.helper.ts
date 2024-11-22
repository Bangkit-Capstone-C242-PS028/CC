import { BadRequestException } from '@nestjs/common';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export function getPaginationParams(page?: number, limit?: number) {
  const currentPage = page || DEFAULT_PAGE;
  const take = limit || DEFAULT_LIMIT;

  if (currentPage < 1) {
    throw new BadRequestException('Page must be greater than 0');
  }

  if (take < 1) {
    throw new BadRequestException('Limit must be greater than 0');
  }

  if (take > MAX_LIMIT) {
    throw new BadRequestException(`Limit must not exceed ${MAX_LIMIT}`);
  }

  const skip = (currentPage - 1) * take;

  return {
    skip,
    take,
    page: currentPage,
  };
}
