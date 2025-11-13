import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { PaymentMethod } from '../domain/model/payment-method.entity';
import { PaymentMethodResource } from './payment-method-resource';
import { PaymentMethodResponse } from './payment-method-response';
import { PaymentMethodAssembler } from './payment-method-assembler';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaymentMethodEndpoint extends BaseApiEndpoint<PaymentMethod, PaymentMethodResource, PaymentMethodResponse, PaymentMethodAssembler> {

  constructor(http: HttpClient) {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const endpoint = environment.platformProviderPaymentMethodsEndpointPath;
    super(http, `${baseUrl}${endpoint}`, new PaymentMethodAssembler());
  }

  /**
   * Get payment methods by user ID
   * CORREGIDO: query params directos
   */
  getByUserId(userId: number): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethodResource[]>(`${this.endpointUrl}?userId=${userId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch payment methods by user ID'))
    );
  }

  /**
   * Add new payment method
   */
  addPaymentMethod(payload: {
    userId: number;
    type: string;
    maskedPan?: string;
    expMonth?: number;
    expYear?: number;
  }): Observable<PaymentMethod> {
    const now = new Date().toISOString();
    const resource: any = {
      userId: payload.userId,
      type: payload.type,
      maskedPan: payload.maskedPan || null,
      expMonth: payload.expMonth || null,
      expYear: payload.expYear || null,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    return this.http.post<PaymentMethodResource>(this.endpointUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to add payment method'))
    );
  }

  /**
   * Disable payment method
   */
  disable(methodId: number): Observable<PaymentMethod> {
    return this.http.patch<PaymentMethodResource>(`${this.endpointUrl}/${methodId}`, {
      status: 'DISABLED',
      updatedAt: new Date().toISOString()
    }).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to disable payment method'))
    );
  }
}
