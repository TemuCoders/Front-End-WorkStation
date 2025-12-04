import { User } from '../domain/model/user.entity';
import { UserResource, UserResponse } from './resources';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
  toEntitiesFromResponse(response: UserResponse): User[] {
    return response.users.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      name: resource.name,
      email: resource.email,
      photo: resource.photo,
      age: resource.age,
      location: resource.location,
      role: resource.role, 
      registerDate: resource.registerDate
    });
  }

  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      photo: entity.photo,
      age: entity.age,
      location: entity.location,
      role: entity.role,  
      registerDate: entity.registerDate
    };
  }
}