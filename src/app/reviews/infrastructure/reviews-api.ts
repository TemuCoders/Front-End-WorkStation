import { Injectable, inject } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ReviewEndpoint } from './review-endpoint';

@Injectable({ providedIn: 'root' })
export class ReviewsApi extends BaseApi {
  readonly reviews = inject(ReviewEndpoint);
}
