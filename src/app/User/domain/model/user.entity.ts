import { UserResource } from '../../infrastructure/resources';

export class User {
  id!: number;
  name!: string;
  email!: string;
  photo!: string;
  age!: number;
  location!: string;
  registerDate!: string;  

  constructor(resource?: UserResource) {
    if (resource) {
      this.id = resource.id;
      this.name = resource.name;
      this.email = resource.email;
      this.photo = resource.photo;
      this.age = resource.age;
      this.location = resource.location;
      this.registerDate = resource.registerDate;
    }
  }
}