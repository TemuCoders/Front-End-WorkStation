/*{"id": 1, "role": "renter", "email": "jeremy.quijada@upc.edu.pe", "password": "$2a$10$hashed", "name": "Jeremy Quijada", "phone": "+51 999 000 111", "avatarUrl": "/imgs/perfil-integrante-jeremy.png", "language": "es", "currency": "PEN", "notifications": {"email": true, "push": false}, "createdAt": "2025-09-05T10:10:00-05:00"},*/
import { UserResource } from '../../infrastructure/resources';

export class User {
  id!: number;
  email!: string;
  name!: string;
  location!: string;
  age!: number;
  password!: string;      // hashed
  photo?: string;
  registerDate!: string;  // ISO
  createdAt!: string;     // ISO
  updatedAt!: string;     // ISO

  constructor(resource?: UserResource) {
    if (resource) {
      this.id = resource.id;
      this.email = resource.email;
      this.name = resource.name;
      this.location = resource.location;
      this.age = resource.age;
      this.password = resource.password;
      this.photo = resource.photo;
      this.registerDate = resource.register_date;
      this.createdAt = resource.created_at;
      this.updatedAt = resource.updated_at;
    }
  }
}
