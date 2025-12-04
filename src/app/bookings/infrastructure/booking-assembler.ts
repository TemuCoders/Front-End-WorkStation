import { Booking } from '../domain/model/booking.entity';
import { BookingResponse } from './booking-response';

export class BookingAssembler {
  toEntityFromResource(resource: BookingResponse): Booking {
    return new Booking(resource);
  }

  toResourceFromEntity(entity: Booking): BookingResponse {
    return {
      bookingCode: entity.bookingCode,
      freelancerId: entity.freelancerId,
      spaceId: entity.spaceId,
      bookingDate: entity.bookingDate,
      startDate: entity.startDate,
      endDate: entity.endDate
    };
  }

  toEntitiesFromResponse(response: BookingResponse[]): Booking[] {
    return response.map(r => this.toEntityFromResource(r));
  }
}