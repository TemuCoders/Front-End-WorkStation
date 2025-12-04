import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Booking } from '../domain/model/booking.entity';
import { BookingResponse } from './booking-response';
import { CreateBookingRequest } from './CreateBookingRequest';
import { ChangeStatusBookingRequest } from './ChangeStatusBookingRequest';
import { BookingAssembler } from './booking-assembler';

@Injectable({ providedIn: 'root' })
export class BookingApiEndpoint {
    private readonly baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderBookingsEndpointPath}`;
  private readonly assembler = new BookingAssembler();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Booking[]> {
    return this.http.get<BookingResponse[]>(this.baseUrl).pipe(
      map(resources => this.assembler.toEntitiesFromResponse(resources))
    );
  }

  getByCode(bookingCode: string): Observable<Booking> {
    return this.http.get<BookingResponse>(`${this.baseUrl}/${bookingCode}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  getBooking(id: number): Observable<Booking> {
  return this.http.get<BookingResponse>(`${this.baseUrl}/${id}`).pipe(
    map(resource => this.assembler.toEntityFromResource(resource))
  );
}


  create(request: CreateBookingRequest): Observable<Booking> {
    return this.http.post<BookingResponse>(this.baseUrl, request).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  changeStatus(bookingCode: string, request: ChangeStatusBookingRequest): Observable<Booking> {
    const params = new HttpParams().set('bookingStatus', request.bookingStatus);
    
    return this.http.put<BookingResponse>(
      `${this.baseUrl}/${bookingCode}/change`,
      null,
      { params }
    ).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }
}