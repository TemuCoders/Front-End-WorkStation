import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BookingApiEndpoint } from '../infrastructure/booking-api-endpoint';
import { Booking } from '../domain/model/booking.entity';
import { CreateBookingRequest } from '../infrastructure/CreateBookingRequest';
import { ChangeStatusBookingRequest } from '../infrastructure/ChangeStatusBookingRequest';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BookingFacade {
  private api = inject(BookingApiEndpoint);
  private router = inject(Router);

  getAllBookings(): Observable<Booking[]> {
    return this.api.getAll(); 
  }

  getBooking(bookingCode: string): Observable<Booking> {
    return this.api.getByCode(bookingCode); 
  }

  createBooking(data: CreateBookingRequest): Observable<Booking> {
    return this.api.create(data); 
  }

  createBookingAndNavigateToPayment(data: CreateBookingRequest): Observable<Booking> {
    return this.api.create(data).pipe( 
      tap(booking => {
        this.goToPayment(booking.bookingCode);
      })
    );
  }

  goToPayment(bookingCode: string): void {
    this.router.navigate(['/payments/checkout', bookingCode]);
  }

  goToBookingDetails(bookingCode: string): void {
    this.router.navigate(['/bookings', bookingCode]);
  }

  goToMyBookings(): void {
    this.router.navigate(['/bookings']);
  }
}