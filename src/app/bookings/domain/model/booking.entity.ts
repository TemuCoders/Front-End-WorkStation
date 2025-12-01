export class Booking {
  code?: string;
  bookingDate!: string;
  startDate!: string;
  endDate!: string;
  status?: string;
  freelancerId!: number;
  spaceId!: number;

  constructor(data: Partial<Booking>) {
    Object.assign(this, data);
  }
}
