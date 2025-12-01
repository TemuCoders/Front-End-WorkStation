import { Routes } from '@angular/router';

const BookingFormPage = () =>
  import('./views/booking-form/booking-form').then(m => m.BookingFormPage);

const BookingsListPage = () =>
  import('./components/bookings-list').then(m => m.BookingsListPage);

export const bookingsRoutes: Routes = [
  {
    path: '',
    loadComponent: BookingsListPage,
    title: 'WorkStation - Mis Reservas'
  },
  {
    path: 'create/:id',
    loadComponent: BookingFormPage,
    title: 'WorkStation - Crear Reserva'
  }
];
