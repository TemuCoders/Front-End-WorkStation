export interface BookingResponse {
  id: number;            // <- json-server SIEMPRE devuelve esto
  freelancerId: number;
  spaceId: number;
  bookingDate: string;
  startDate: string;
  endDate: string;
}
