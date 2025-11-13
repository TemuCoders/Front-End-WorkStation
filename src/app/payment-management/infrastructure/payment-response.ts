import { BaseResponse } from '../../shared/infrastructure/base-response';
import { PaymentResource } from './payment-resource';

export interface PaymentResponse extends BaseResponse {
  data: PaymentResource[];
}
