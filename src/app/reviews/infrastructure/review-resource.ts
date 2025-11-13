import { BaseResource } from '../../shared/infrastructure/base-response';

export interface ReviewResource extends BaseResource {
  spaceId: number;
  userId: number;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
