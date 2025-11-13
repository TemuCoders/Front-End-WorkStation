import { BaseResponse } from '../../shared/infrastructure/base-response';
import { ReviewResource } from './review-resource';

export interface ReviewResponse extends BaseResponse {
  data: ReviewResource[];
}
