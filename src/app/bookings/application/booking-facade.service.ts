import { Injectable, inject } from '@angular/core';
import { BookingsApi } from '../infrastructure/bookings-api';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BookingFacade {
  private api = inject(BookingsApi);
  private router = inject(Router);

  createBooking(data: {
    freelancerId: number;
    spaceId: number;
    bookingDate: string;
    startDate: string;
    endDate: string;
  }) {
    return this.api.createBooking(data);
  }

  goToPayment(bookingCode: string) {
    this.router.navigate(['/payments/checkout', bookingCode]);
  }
}
