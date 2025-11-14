import { User } from '../domain/model/user.entity';
import { UserResource, UserResponse } from './resources';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
  toEntitiesFromResponse(response: UserResponse): User[] {
    return response.users.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: UserResource): User {
    return new User(resource);
  }

  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      age: entity.age,
      email: entity.email,
      location: entity.location,
      name: entity.name,
      password: entity.password,
      photo: entity.photo,
      register_date: entity.registerDate
    };
  }
}
