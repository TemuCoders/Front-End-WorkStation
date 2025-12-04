import { Injectable, inject, signal, computed } from '@angular/core';
import { ReviewsApi } from '../infrastructure/reviews-api';
import { Review } from '../domain/model/review.entity';
import { ReviewResource } from '../infrastructure/review-resource';
import { ReviewStatus } from '../domain/model/review.entity';
import { switchMap, forkJoin, map } from 'rxjs';
import { UserApiEndpoint } from '../../User/infrastructure/user-api.endpoint';
import { ReviewViewModel } from '../infrastructure/review-view-model';

@Injectable({ providedIn: 'root' })
export class ReviewFacade {

  private api = inject(ReviewsApi);

  reviews = signal<Review[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  currentPage = signal(0);
  pageSize = signal(10);

  private mapToEntity(resource: ReviewResource): Review {
    return {
      id: resource.id,
      spaceId: resource.spaceId,
      userId: resource.userId,
      rating: resource.rating,
      comment: resource.comment,
      status: resource.status as ReviewStatus,
      createdAt: resource.createdAt ?? '',
      updatedAt: resource.updatedAt ?? '',
    };
  }


  averageRating = computed(() => {
    const published = this.reviews().filter(r => r.status === 'PUBLISHED');
    if (published.length === 0) return 0;

    const sum = published.reduce((acc, r) => acc + r.rating, 0);
    return sum / published.length;
  });

  totalCount = computed(() => {
    return this.reviews().filter(r => r.status === 'PUBLISHED').length;
  });


  loadBySpaceId(spaceId: number, page = 0, size = 10): void {
    this.loading.set(true);
    this.error.set(null);

    this.currentPage.set(page);
    this.pageSize.set(size);

    this.api.reviews.getBySpace(spaceId, page, size).subscribe({
      next: (resources: ReviewResource[]) => {
        this.reviews.set(resources.map(r => this.mapToEntity(r)));
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  create(payload: {
    spaceId: number;
    userId: number;
    rating: number;
    comment: string;
  }): void {
    this.api.reviews.createReview(payload).subscribe({
      next: (resource: ReviewResource) => {
        const entity = this.mapToEntity(resource);
        this.reviews.update(list => [entity, ...list]);
      },
      error: (err: any) => {
        this.error.set(err.message);
      }
    });
  }

  // ---------------------------------------------------------
  // UPDATE REVIEW
  // ---------------------------------------------------------
  update(reviewId: number, payload: {
    rating: number;
    comment: string;
  }): void {
    this.api.reviews.updateReview(reviewId, payload).subscribe({
      next: (resource: ReviewResource) => {
        const updated = this.mapToEntity(resource);

        this.reviews.update(list =>
          list.map(r => (r.id === reviewId ? updated : r))
        );
      },
      error: (err: any) => {
        this.error.set(err.message);
      }
    });
  }

  // ---------------------------------------------------------
  // DELETE REVIEW
  // ---------------------------------------------------------
  delete(reviewId: number): void {
    this.api.reviews.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews.update(list => list.filter(r => r.id !== reviewId));
      },
      error: (err: any) => {
        this.error.set(err.message);
      }
    });
  }

}
