import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { PaymentMethod } from '../domain/model/payment-method.entity';
import { PaymentMethodResource } from './payment-method-resource';
import { PaymentMethodResponse } from './payment-method-response';

export class PaymentMethodAssembler implements BaseAssembler<PaymentMethod, PaymentMethodResource, PaymentMethodResponse> {

  toEntityFromResource(resource: PaymentMethodResource): PaymentMethod {
    const method = new PaymentMethod();
    method.id = resource.id;
    method.userId = resource.userId;
    method.type = resource.type as any;
    method.maskedPan = resource.maskedPan;
    method.expMonth = resource.expMonth;
    method.expYear = resource.expYear;
    method.status = resource.status as any;
    method.createdAt = resource.createdAt;
    method.updatedAt = resource.updatedAt;
    return method;
  }

  toResourceFromEntity(entity: PaymentMethod): PaymentMethodResource {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      maskedPan: entity.maskedPan,
      expMonth: entity.expMonth,
      expYear: entity.expYear,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  toEntitiesFromResponse(response: PaymentMethodResponse): PaymentMethod[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }
}
