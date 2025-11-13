import { Injectable, inject, signal } from '@angular/core';
import { PaymentManagementApi } from '../infrastructure/payment-management-api';
import { Invoice } from '../domain/model/invoice.entity';

@Injectable({ providedIn: 'root' })
export class InvoiceFacade {
  private api = inject(PaymentManagementApi);

  invoice = signal<Invoice | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  loadById(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.invoices.getById(id).subscribe({
      next: (invoice) => {
        this.invoice.set(invoice);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  loadByBookingId(bookingId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.invoices.getByBookingId(bookingId).subscribe({
      next: (invoice) => {
        this.invoice.set(invoice);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  send(id: number): void {
    this.api.invoices.send(id).subscribe({
      next: (updatedInvoice) => {
        this.invoice.set(updatedInvoice);
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }
}
