import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Review } from '../domain/model/review.entity';
import { ReviewResource } from './review-resource';
import { ReviewResponse } from './review-response';
import { ReviewAssembler } from './review-assembler';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReviewEndpoint extends BaseApiEndpoint<Review, ReviewResource, ReviewResponse, ReviewAssembler> {

  constructor(http: HttpClient) {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const endpoint = environment.platformProviderReviewsEndpointPath;
    super(http, `${baseUrl}${endpoint}`, new ReviewAssembler());
  }

  /**
   * Get reviews by space ID with pagination
   * CORREGIDO: query params directos en json-server
   */
  getBySpaceId(spaceId: number, page = 0, size = 10): Observable<Review[]> {
    const skip = page * size;
    // json-server usa _start y _limit para paginación
    return this.http.get<ReviewResource[]>(
      `${this.endpointUrl}?spaceId=${spaceId}&_start=${skip}&_limit=${size}&_sort=createdAt&_order=desc`
    ).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch reviews by space ID'))
    );
  }

  /**
   * Get reviews by user ID
   */
  getByUserId(userId: number): Observable<Review[]> {
    return this.http.get<ReviewResource[]>(`${this.endpointUrl}?userId=${userId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch reviews by user ID'))
    );
  }

  /**
   * Create review
   */
  createReview(payload: {
    spaceId: number;
    userId: number;
    rating: number;
    comment: string;
  }): Observable<Review> {
    const now = new Date().toISOString();
    const resource: any = {
      spaceId: payload.spaceId,
      userId: payload.userId,
      rating: payload.rating,
      comment: payload.comment,
      status: 'PUBLISHED',
      createdAt: now,
      updatedAt: now
    };

    return this.http.post<ReviewResource>(this.endpointUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create review'))
    );
  }

  /**
   * Update review
   */
  updateReview(reviewId: number, payload: { rating: number; comment: string }): Observable<Review> {
    return this.http.patch<ReviewResource>(`${this.endpointUrl}/${reviewId}`, {
      rating: payload.rating,
      comment: payload.comment,
      updatedAt: new Date().toISOString()
    }).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to update review'))
    );
  }

  /**
   * Soft delete review
   */
  deleteReview(reviewId: number): Observable<Review> {
    return this.http.patch<ReviewResource>(`${this.endpointUrl}/${reviewId}`, {
      status: 'DELETED',
      updatedAt: new Date().toISOString()
    }).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to delete review'))
    );
  }
}
