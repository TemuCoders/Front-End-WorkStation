import { BaseResponse } from '../../shared/infrastructure/base-response';
import { PaymentMethodResource } from './payment-method-resource';

export interface PaymentMethodResponse extends BaseResponse {
  data: PaymentMethodResource[];
}
