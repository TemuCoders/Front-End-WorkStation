import { Injectable, inject, signal } from '@angular/core';
import { PaymentManagementApi } from '../infrastructure/payment-management-api';
import { Payment } from '../domain/model/payment.entity';

@Injectable({ providedIn: 'root' })
export class PaymentFacade {
  private api = inject(PaymentManagementApi);

  payments = signal<Payment[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  loadByInvoiceId(invoiceId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.payments.getByInvoiceId(invoiceId).subscribe({
      next: (payments) => {
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  create(payload: {
    invoiceId: number;
    bookingId: number;
    userId: number;
    paymentMethodId: number;
    amount: number;
    currency: string;
  }): void {
    this.api.payments.createPayment(payload).subscribe({
      next: (payment) => {
        this.payments.update(list => [...list, payment]);
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }

  refund(paymentId: number): void {
    this.api.payments.refund(paymentId).subscribe({
      next: (updatedPayment) => {
        this.payments.update(list =>
          list.map(p => p.id === paymentId ? updatedPayment : p)
        );
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }
}
