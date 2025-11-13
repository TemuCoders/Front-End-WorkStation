import { Injectable, inject, signal, computed } from '@angular/core';
import { ReviewsApi } from '../infrastructure/reviews-api';
import { Review } from '../domain/model/review.entity';

@Injectable({ providedIn: 'root' })
export class ReviewFacade {
  private api = inject(ReviewsApi);

  reviews = signal<Review[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(0);
  pageSize = signal(10);

  // Computed: average rating
  averageRating = computed(() => {
    const published = this.reviews().filter(r => r.status === 'PUBLISHED');
    if (published.length === 0) return 0;
    const sum = published.reduce((acc, r) => acc + r.rating, 0);
    return sum / published.length;
  });

  // Computed: total count
  totalCount = computed(() => {
    return this.reviews().filter(r => r.status === 'PUBLISHED').length;
  });

  loadBySpaceId(spaceId: number, page = 0, size = 10): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(page);
    this.pageSize.set(size);

    this.api.reviews.getBySpaceId(spaceId, page, size).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.loading.set(false);
      },
      error: (err) => {
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
      next: (review) => {
        this.reviews.update(list => [review, ...list]);
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }

  update(reviewId: number, payload: { rating: number; comment: string }): void {
    this.api.reviews.updateReview(reviewId, payload).subscribe({
      next: (updatedReview) => {
        this.reviews.update(list =>
          list.map(r => r.id === reviewId ? updatedReview : r)
        );
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }

  delete(reviewId: number): void {
    this.api.reviews.deleteReview(reviewId).subscribe({
      next: (deletedReview) => {
        this.reviews.update(list =>
          list.map(r => r.id === reviewId ? deletedReview : r)
        );
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }
}
