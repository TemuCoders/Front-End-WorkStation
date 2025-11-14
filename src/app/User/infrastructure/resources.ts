import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface UserResponse extends BaseResponse {
  users: UserResource[];
}

export interface UserResource extends BaseResource {
  id: number;
  created_at: string;   // ISO
  updated_at: string;   // ISO
  age: number;
  email: string;
  location: string;
  name: string;
  password: string;     // hashed
  photo?: string;
  register_date: string; // ISO
}
