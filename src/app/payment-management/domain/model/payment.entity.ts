import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export class Payment implements BaseEntity {
  id: number = 0;
  invoiceId: number = 0;
  bookingId: number = 0;
  userId: number = 0;
  amount: number = 0;
  currency: string = 'USD';
  status: PaymentStatus = 'PENDING';
  paymentMethodId: number = 0;
  paidAt: string | null = null;
  refundedAt: string | null = null;
  createdAt: string = '';
  updatedAt: string = '';
}
