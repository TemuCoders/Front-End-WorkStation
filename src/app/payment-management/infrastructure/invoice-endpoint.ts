import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Invoice } from '../domain/model/invoice.entity';
import { InvoiceResource } from './invoice-resource';
import { InvoiceResponse } from './invoice-response';
import { InvoiceAssembler } from './invoice-assembler';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InvoiceEndpoint extends BaseApiEndpoint<Invoice, InvoiceResource, InvoiceResponse, InvoiceAssembler> {

  constructor(http: HttpClient) {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const endpoint = environment.platformProviderInvoicesEndpointPath;
    super(http, `${baseUrl}${endpoint}`, new InvoiceAssembler());
  }

  /**
   * Get invoice by booking ID
   * CORREGIDO: json-server usa query params directamente
   */
  getByBookingId(bookingId: number): Observable<Invoice> {
    return this.http.get<InvoiceResource[]>(`${this.endpointUrl}?bookingId=${bookingId}`).pipe(
      map(response => {
        if (response.length === 0) {
          throw new Error('Invoice not found for booking: ' + bookingId);
        }
        return this.assembler.toEntityFromResource(response[0]);
      }),
      catchError(this.handleError('Failed to fetch invoice by booking ID'))
    );
  }

  /**
   * Send invoice (cambiar estado a SENT)
   */
  send(invoiceId: number): Observable<Invoice> {
    const sentAt = new Date().toISOString();
    return this.http.patch<InvoiceResource>(`${this.endpointUrl}/${invoiceId}`, {
      status: 'SENT',
      sentAt,
      updatedAt: sentAt
    }).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to send invoice'))
    );
  }
}
