import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export type PaymentMethodType = 'CARD' | 'CASH_DEMO' | 'TRANSFER_DEMO';
export type PaymentMethodStatus = 'ACTIVE' | 'DISABLED';

export class PaymentMethod implements BaseEntity {
  id: number = 0;
  userId: number = 0;
  type: PaymentMethodType = 'CARD';
  maskedPan: string | null = null;
  expMonth: number | null = null;
  expYear: number | null = null;
  status: PaymentMethodStatus = 'ACTIVE';
  createdAt: string = '';
  updatedAt: string = '';
}
