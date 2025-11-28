import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';


export interface ServicesResponse extends BaseResponse {
  id: number;
  spaceId: number;
  name: string;
  description: string;
  price: number;
}

export interface ServicesResource extends BaseResource {
  spaceId: number;
  name: string;
  description: string;
  price: number;
}

