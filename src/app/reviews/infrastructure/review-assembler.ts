import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Review } from '../domain/model/review.entity';
import { ReviewResource } from './review-resource';
import { ReviewResponse } from './review-response';

export class ReviewAssembler implements BaseAssembler<Review, ReviewResource, ReviewResponse> {

  toEntityFromResource(resource: ReviewResource): Review {
    const review = new Review();
    review.id = resource.id;
    review.spaceId = resource.spaceId;
    review.userId = resource.userId;
    review.rating = resource.rating;
    review.comment = resource.comment;
    review.status = resource.status as any;
    review.createdAt = resource.createdAt;
    review.updatedAt = resource.updatedAt;
    return review;
  }

  toResourceFromEntity(entity: Review): ReviewResource {
    return {
      id: entity.id,
      spaceId: entity.spaceId,
      userId: entity.userId,
      rating: entity.rating,
      comment: entity.comment,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntitiesFromResponse(response: ReviewResponse): Review[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }
}
