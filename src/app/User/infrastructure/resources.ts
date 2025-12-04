import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface UserResponse extends BaseResponse {
  users: UserResource[];
}

export interface UserResource extends BaseResource {
  id: number;
  name: string;
  email: string;
  photo: string;
  age: number;
  location: string;
  role: {
    roleName: string;
  };
  registerDate: string;
}