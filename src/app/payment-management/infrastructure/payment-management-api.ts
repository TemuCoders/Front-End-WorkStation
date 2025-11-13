import { Injectable, inject } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { InvoiceEndpoint } from './invoice-endpoint';
import { PaymentEndpoint } from './payment-endpoint';
import { PaymentMethodEndpoint } from './payment-method-endpoint';

/**
 * API Central para Payment Management.
 * Compone todos los endpoints relacionados.
 */
@Injectable({ providedIn: 'root' })
export class PaymentManagementApi extends BaseApi {

  readonly invoices = inject(InvoiceEndpoint);
  readonly payments = inject(PaymentEndpoint);
  readonly paymentMethods = inject(PaymentMethodEndpoint);
}
