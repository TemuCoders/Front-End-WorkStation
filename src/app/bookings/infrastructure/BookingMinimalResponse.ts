export interface BookingMinimalResponse {
  bookingCode: string;            // <- json-server SIEMPRE devuelve esto
  spaceId: number;
  startDate: string;
  endDate: string;
}
