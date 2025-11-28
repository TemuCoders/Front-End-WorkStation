import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {AddressesResource} from './addresses-response';
import {ServicesResource} from './services-response';

export interface WorkspacesResponse extends BaseResponse {
  workspaces: WorkspacesResource[];
}

export interface WorkspacesResource extends BaseResource {
  name: string;
  description: string;
  spaceType: string;
  capacity: number;
  price: number;
  img: string;          
  available: boolean;   
  address: AddressesResource;
  ownerId: number;     
}