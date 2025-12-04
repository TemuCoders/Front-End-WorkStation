import {BookingResponse} from '../../infrastructure/booking-response';

export class Booking {
  bookingCode!: string;
  freelancerId!: number;
  spaceId!: number;
  bookingDate!: string;
  startDate!: string;
  endDate!: string;

  constructor(resource?: BookingResponse) {
    if (resource){
      this.bookingCode = resource.bookingCode;
      this.freelancerId = resource.freelancerId;
      this.spaceId = resource.spaceId;
      this.bookingDate = resource.bookingDate;
      this.startDate = resource.startDate;
      this.endDate = resource.endDate;
    }
  }

  getStartDateObj(): Date {
    return new Date(this.startDate);
  }

  getEndDateObj(): Date {
    return new Date(this.endDate);
  }

  getBookingDateObj(): Date {
    return new Date(this.bookingDate);
  }

  getDurationDays(): number {
    const start = this.getStartDateObj();
    const end = this.getEndDateObj();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
