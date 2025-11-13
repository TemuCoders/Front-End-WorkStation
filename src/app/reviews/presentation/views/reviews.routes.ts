import { Routes } from '@angular/router';
import { ReviewsComponent } from './reviews/reviews';

export const reviewsRoutes: Routes = [
  {
    path: '',
    component: ReviewsComponent,
    title: 'WorkStation - Reviews'
  },
  {
    path: ':spaceId',
    component: ReviewsComponent,
    title: 'WorkStation - Space Reviews'
  }
];
