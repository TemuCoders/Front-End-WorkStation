import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export type ReviewStatus = 'PUBLISHED' | 'DELETED';

export class Review implements BaseEntity {
  id: number = 0;
  spaceId: number = 0;
  userId: number = 0;
  rating: number = 5;
  comment: string = '';
  status: ReviewStatus = 'PUBLISHED';
  createdAt: string = '';
  updatedAt: string = '';
}
