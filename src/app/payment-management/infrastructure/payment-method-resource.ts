import { BaseResource } from '../../shared/infrastructure/base-response';

export interface PaymentMethodResource extends BaseResource {
  userId: number;
  type: string;
  maskedPan: string | null;
  expMonth: number | null;
  expYear: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
