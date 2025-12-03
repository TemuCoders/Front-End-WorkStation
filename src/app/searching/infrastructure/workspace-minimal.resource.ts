export interface WorkspaceMinimalResource {
  spaceId: number;
  name: string;
  ownerId: number;  
  spaceType: string;
  capacity: number;
  price: number;
  description: string;
  available: boolean;
  address: string;  
  images: string[];  
}