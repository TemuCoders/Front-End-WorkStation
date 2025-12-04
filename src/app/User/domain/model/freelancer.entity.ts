import { FreelancerResource } from "../../infrastructure/freelancer.resource";

export class Freelancer {
  id!: number;
  userId!: number;
  userType!: string;
  preferences!: string[];

  constructor(resource?: FreelancerResource) {
    if (resource) {
      this.id = resource.id;
      this.userId = resource.userId;
      this.userType = resource.userType;
      this.preferences = resource.preferences || [];
    }
  }
}