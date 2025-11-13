import { BaseResource } from '../../shared/infrastructure/base-response';

export interface InvoiceLineResource {
  id: number;
  description: string;
  quantity: number;
  unitAmount: number;
  tax: number;
  subtotal: number;
  total: number;
}

export interface InvoiceResource extends BaseResource {
  invoiceNumber: string;
  bookingId: number;
  userId: number;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  issuedAt: string | null;
  sentAt: string | null;
  lines: InvoiceLineResource[];
  createdAt: string;
  updatedAt: string;
}
