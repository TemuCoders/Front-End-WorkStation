export interface BookingMinimalResponse {
  bookingCode: string;
  spaceId: number;
  startDate: string;
  endDate: string;
}

export interface BookingResponse {
  bookingCode: string;
  freelancerId: number;
  spaceId: number;
  bookingDate: string;
  startDate: string;
  endDate: string;
}