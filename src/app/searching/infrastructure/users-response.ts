import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface UsersResponse extends BaseResponse {
  firstName: string;
  lastName: string;
}

export interface UsersResource extends BaseResource {
  firstName: string;
  lastName: string;
}
