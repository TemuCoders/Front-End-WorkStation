export interface CreateBookingRequest {
  freelancerId: number;
  spaceId: number;
  bookingDate: string;
  startDate: string;
  endDate: string;
}
