import { BaseResponse } from '../../shared/infrastructure/base-response';
import { InvoiceResource } from './invoice-resource';

export interface InvoiceResponse extends BaseResponse {
  data: InvoiceResource[];
}
