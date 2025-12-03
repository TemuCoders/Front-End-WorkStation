import { Routes } from '@angular/router';

const BookingFormPage = () =>
  import('./views/booking-form/booking-form').then(m => m.BookingFormPage);

const BookingDetailPage = () =>
  import('./views/booking-detail/booking-detail').then(m => m.BookingDetailPage);

const BookingListPage = () =>
  import('./views/booking-list/booking-list').then(m => m.BookingListPage);

export const bookingsRoutes: Routes = [
  { path: 'list', loadComponent: BookingListPage },
  { path: 'create/:id', loadComponent: BookingFormPage },

  // MUY IMPORTANTE → siempre AL FINAL
  { path: ':bookingId', loadComponent: BookingDetailPage }
];


