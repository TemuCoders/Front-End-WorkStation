import { OwnerResource } from "../../infrastructure/owner.resource";

export class Owner {
  id!: number;
  userId!: number;
  company!: string;
  ruc!: string;
  registeredSpaceIds!: number[];

  constructor(resource?: OwnerResource) {
    if (resource) {
      this.id = resource.id;
      this.userId = resource.userId;
      this.company = resource.company;
      this.ruc = resource.ruc;
      this.registeredSpaceIds = resource.registeredSpaceIds || [];
    }
  }
}