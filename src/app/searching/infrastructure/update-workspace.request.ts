export interface UpdateWorkspaceRequest {
  spaceId: number;
  name: string;
  ownerId: number;
  spaceType: string;
  price: number;
  capacity: number;
  description: string;
  available: boolean;
  street: string;
  streetNumber: string;
  city: string;
  postalCode: string;  
  images: string[];  
}