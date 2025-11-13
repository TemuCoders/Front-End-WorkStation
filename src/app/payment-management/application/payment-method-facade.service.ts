import { Injectable, inject, signal } from '@angular/core';
import { PaymentManagementApi } from '../infrastructure/payment-management-api';
import { PaymentMethod } from '../domain/model/payment-method.entity';

@Injectable({ providedIn: 'root' })
export class PaymentMethodFacade {
  private api = inject(PaymentManagementApi);

  paymentMethods = signal<PaymentMethod[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  loadByUserId(userId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.paymentMethods.getByUserId(userId).subscribe({
      next: (methods) => {
        this.paymentMethods.set(methods);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  add(payload: {
    userId: number;
    type: string;
    maskedPan?: string;
    expMonth?: number;
    expYear?: number;
  }): void {
    this.api.paymentMethods.addPaymentMethod(payload).subscribe({
      next: (method) => {
        this.paymentMethods.update(list => [...list, method]);
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }

  disable(id: number): void {
    this.api.paymentMethods.disable(id).subscribe({
      next: (updatedMethod) => {
        this.paymentMethods.update(list =>
          list.map(m => m.id === id ? updatedMethod : m)
        );
      },
      error: (err) => {
        this.error.set(err.message);
      }
    });
  }
}
