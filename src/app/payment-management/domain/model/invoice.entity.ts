import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'SENT' | 'PAID' | 'CANCELLED';

export class InvoiceLine {
  id: number = 0;
  description: string = '';
  quantity: number = 1;
  unitAmount: number = 0;
  tax: number = 0;
  subtotal: number = 0;
  total: number = 0;
}

export class Invoice implements BaseEntity {
  id: number = 0;
  invoiceNumber: string = '';
  bookingId: number = 0;
  userId: number = 0;
  currency: string = 'USD';
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  status: InvoiceStatus = 'DRAFT';
  issuedAt: string | null = null;
  sentAt: string | null = null;
  lines: InvoiceLine[] = [];
  createdAt: string = '';
  updatedAt: string = '';
}
