import { BaseResource } from '../../shared/infrastructure/base-response';

export interface PaymentResource extends BaseResource {
  invoiceId: number;
  bookingId: number;
  userId: number;
  amount: number;
  currency: string;
  status: string;
  paymentMethodId: number;
  paidAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
