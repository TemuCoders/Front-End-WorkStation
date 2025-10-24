import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {AddressesResource, AddressesResponse} from './addresses-response';
import {UsersResource, UsersResponse} from './users-response';
import {ServicesResource, ServicesResponse} from './services-response';

export interface WorkspacesResponse extends BaseResponse {
  workspaces: WorkspacesResource[];
}

export interface WorkspacesResource extends BaseResource {
  name: string;
  description: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  imageUrl: string;
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  address: AddressesResource;
  owner: UsersResource;
  services: ServicesResource[];
}
