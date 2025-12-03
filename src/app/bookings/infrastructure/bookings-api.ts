import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BookingsEndpoint } from './bookings-endpoint';
import { Booking } from '../domain/model/booking.entity';
import { BookingResponse } from './booking-response';

@Injectable({ providedIn: 'root' })
export class BookingsApi {
  private http = inject(HttpClient);

  createBooking(payload: any) {
    return this.http.post<any>('http://localhost:3000/bookings', payload);
  }

  getBooking(id: number) {
    return this.http.get<any>(`http://localhost:3000/bookings/${id}`);
  }

  getBookings() {
    return this.http.get<any[]>(`http://localhost:3000/bookings`);
  }
}

