import { BaseResource } from '../../shared/infrastructure/base-response';

export interface WorkspaceResource extends BaseResource {
  spaceId: number;
  name: string;
  ownerId: number;
  spaceType: string;
  capacity: number;
  price: number;
  description: string;
  available: boolean;
  street: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  images: string[]; 
}