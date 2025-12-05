import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PaymentMethod } from '../domain/model/payment-method.entity';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodFacade {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.platformProviderApiBaseUrl;

  private paymentMethodsSignal = signal<PaymentMethod[]>([]);
  private loadingSignal = signal(false);

  paymentMethods = computed(() => this.paymentMethodsSignal());
  loading = computed(() => this.loadingSignal());

  // ✅ GET /api/v1/payment-methods?userId=...
  loadByUserId(userId: number): void {
    if (!userId) {
      console.warn('PaymentMethodFacade.loadByUserId: userId inválido', userId);
      return;
    }

    this.loadingSignal.set(true);

    this.http
      .get<PaymentMethod[]>(`${this.baseUrl}/payment-methods`, {
        params: { userId: userId.toString() }
      })
      .pipe(
        tap(methods => this.paymentMethodsSignal.set(methods)),
        finalize(() => this.loadingSignal.set(false))
      )
      .subscribe({
        error: err => {
          console.error('Error cargando métodos de pago:', err);
          this.paymentMethodsSignal.set([]);
        }
      });
  }

  // ✅ POST /api/v1/payment-methods
  add(payload: {
    userId: number;
    type: string;
    maskedPan?: string;
    expMonth?: number | null;
    expYear?: number | null;
  }): void {
    console.log('[PaymentMethodFacade.add] payload enviado:', payload);

    this.http
      .post<PaymentMethod>(`${this.baseUrl}/payment-methods`, payload)
      .subscribe({
        next: created => {
          this.paymentMethodsSignal.set([...this.paymentMethodsSignal(), created]);
        },
        error: err => {
          console.error('Error creando método de pago:', err);
        }
      });
  }

  // ✅ DELETE /api/v1/payment-methods/{id}
  disable(id: number): void {
    this.http
      .delete<void>(`${this.baseUrl}/payment-methods/${id}`)
      .subscribe({
        next: () => {
          this.paymentMethodsSignal.set(
            this.paymentMethodsSignal().map(m =>
              m.id === id ? { ...m, status: 'DISABLED' } : m
            )
          );
        },
        error: err => {
          console.error('Error deshabilitando método de pago:', err);
        }
      });
  }
}
