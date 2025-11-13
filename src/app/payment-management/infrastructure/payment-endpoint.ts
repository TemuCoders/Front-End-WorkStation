import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Payment } from '../domain/model/payment.entity';
import { PaymentResource } from './payment-resource';
import { PaymentResponse } from './payment-response';
import { PaymentAssembler } from './payment-assembler';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaymentEndpoint extends BaseApiEndpoint<Payment, PaymentResource, PaymentResponse, PaymentAssembler> {

  constructor(http: HttpClient) {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const endpoint = environment.platformProviderPaymentsEndpointPath;
    super(http, `${baseUrl}${endpoint}`, new PaymentAssembler());
  }

  /**
   * Get payments by invoice ID
   * CORREGIDO: query params directos
   */
  getByInvoiceId(invoiceId: number): Observable<Payment[]> {
    return this.http.get<PaymentResource[]>(`${this.endpointUrl}?invoiceId=${invoiceId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch payments by invoice ID'))
    );
  }

  /**
   * Create payment with auto-paid status
   */
  createPayment(payload: {
    invoiceId: number;
    bookingId: number;
    userId: number;
    paymentMethodId: number;
    amount: number;
    currency: string;
  }): Observable<Payment> {
    const now = new Date().toISOString();
    const resource: any = {
      invoiceId: payload.invoiceId,
      bookingId: payload.bookingId,
      userId: payload.userId,
      paymentMethodId: payload.paymentMethodId,
      amount: payload.amount,
      currency: payload.currency,
      status: 'PAID',
      paidAt: now,
      refundedAt: null,
      createdAt: now,
      updatedAt: now
    };

    return this.http.post<PaymentResource>(this.endpointUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create payment'))
    );
  }

  /**
   * Refund payment (cambiar estado a REFUNDED)
   */
  refund(paymentId: number): Observable<Payment> {
    const refundedAt = new Date().toISOString();
    return this.http.patch<PaymentResource>(`${this.endpointUrl}/${paymentId}`, {
      status: 'REFUNDED',
      refundedAt,
      updatedAt: refundedAt
    }).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to refund payment'))
    );
  }
}
