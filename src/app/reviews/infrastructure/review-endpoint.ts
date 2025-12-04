import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReviewResource } from './review-resource';
import { Review } from '../domain/model/review.entity';

@Injectable({ providedIn: 'root' })
export class ReviewEndpoint {

  private baseUrl = environment.platformProviderApiBaseUrl;

  constructor(private http: HttpClient) {}

  getById(reviewId: number): Observable<ReviewResource> {
    return this.http.get<ReviewResource>(`${this.baseUrl}/reviews/${reviewId}`);
  }

  getBySpace(spaceId: number, page = 0, size = 20): Observable<ReviewResource[]> {
    return this.http
      .get<any>(`${this.baseUrl}/spaces/${spaceId}/reviews?page=${page}&size=${size}`)
      .pipe(
        map((pageResponse) => pageResponse.content),
        catchError((err) => {
          console.error(err);
          throw err;
        })
      );
  }

  getByUser(userId: number): Observable<ReviewResource[]> {
    return this.http.get<ReviewResource[]>(
      `${this.baseUrl}/users/${userId}/reviews`
    );
  }

  getSummary(spaceId: number): Observable<{ averageRating: number; totalCount: number }> {
    return this.http.get<{ averageRating: number; totalCount: number }>(
      `${this.baseUrl}/spaces/${spaceId}/reviews/summary`
    );
  }

  createReview(payload: {
    spaceId: number;
    userId: number;
    rating: number;
    comment: string;
  }): Observable<ReviewResource> {
    return this.http.post<ReviewResource>(`${this.baseUrl}/reviews`, payload)
      .pipe(
        catchError((err) => {
          console.error(err);
          throw err;
        })
      );
  }

  updateReview(reviewId: number, payload: {
    rating: number;
    comment: string;
  }): Observable<ReviewResource> {
    return this.http.put<ReviewResource>(`${this.baseUrl}/reviews/${reviewId}`, payload)
      .pipe(
        catchError((err) => {
          console.error(err);
          throw err;
        })
      );
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reviews/${reviewId}`);
  }
}
