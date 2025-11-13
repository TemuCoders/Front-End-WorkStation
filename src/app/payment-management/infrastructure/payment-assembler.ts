import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Payment } from '../domain/model/payment.entity';
import { PaymentResource } from './payment-resource';
import { PaymentResponse } from './payment-response';

export class PaymentAssembler implements BaseAssembler<Payment, PaymentResource, PaymentResponse> {

  toEntityFromResource(resource: PaymentResource): Payment {
    const payment = new Payment();
    payment.id = resource.id;
    payment.invoiceId = resource.invoiceId;
    payment.bookingId = resource.bookingId;
    payment.userId = resource.userId;
    payment.amount = resource.amount;
    payment.currency = resource.currency;
    payment.status = resource.status as any;
    payment.paymentMethodId = resource.paymentMethodId;
    payment.paidAt = resource.paidAt;
    payment.refundedAt = resource.refundedAt;
    payment.createdAt = resource.createdAt;
    payment.updatedAt = resource.updatedAt;
    return payment;
  }

  toResourceFromEntity(entity: Payment): PaymentResource {
    return {
      id: entity.id,
      invoiceId: entity.invoiceId,
      bookingId: entity.bookingId,
      userId: entity.userId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      paymentMethodId: entity.paymentMethodId,
      paidAt: entity.paidAt,
      refundedAt: entity.refundedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntitiesFromResponse(response: PaymentResponse): Payment[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }
}
