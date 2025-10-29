import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';


export interface ServicesResponse extends BaseResponse {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export interface ServicesResource extends BaseResource {
  name: string;
  icon: string;
  description: string;
}

