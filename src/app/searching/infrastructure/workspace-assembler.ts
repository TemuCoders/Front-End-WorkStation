import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Workspace} from '../domain/model/workspace.entity';
import {WorkspacesResource, WorkspacesResponse} from './workspaces-response';
import {Service} from '../domain/model/service.entity';
import {User} from '../domain/model/user.entity';
import {Address} from '../domain/model/address.entity';


export class WorkspaceAssembler implements BaseAssembler<Workspace, WorkspacesResource, WorkspacesResponse> {

  /**
   * Convierte un WorkspacesResponse (que contiene un array workspaces)
   * a una lista de entidades Workspace.
   */
  toEntitiesFromResponse(response: WorkspacesResponse): Workspace[] {
    const resources = response.workspaces ?? [];
    return resources.map((r) => this.toEntityFromResource(r));
  }
  /**
   * Convierte un WorkspacesResource (un workspace) a la entidad Workspace.
   */
  toEntityFromResource(resource: WorkspacesResource): Workspace {
    const address = new Address({
      street: resource.address.street,
      number: resource.address.number,
      district: resource.address.district,
      city: resource.address.city,
    });

    const owner = new User({
      firstName: resource.owner.firstName,
      lastName: resource.owner.lastName,
    });

    const services = (resource.services ?? []).map(s => new Service({
      id: (s as any)?.id ?? 0,
      name: s.name,
      icon: s.icon,
      description: s.description
    }));

    return new Workspace({
      id: resource.id ?? 0,
      name: resource.name,
      description: resource.description,
      type: resource.type,
      capacity: resource.capacity,
      pricePerDay: resource.pricePerDay,
      isAvailable: resource.isAvailable,
      averageRating: resource.averageRating,
      imageUrl: resource.imageUrl,
      address,
      owner,
      services
    });
  }

  /**
   * Convierte una entidad Workspace a WorkspacesResource (lista para enviar al backend).
   */
  toResourceFromEntity(entity: Workspace): WorkspacesResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      type: entity.type,
      capacity: entity.capacity,
      pricePerDay: entity.pricePerDay,
      isAvailable: entity.isAvailable,
      averageRating: entity.averageRating,
      imageUrl: entity.imageUrl,
      address: {
        street: entity.address.street,
        district: entity.address.district,
        city: entity.address.city,
      },
      owner: {
        firstName: entity.owner.firstName,
        lastName: entity.owner.lastName,
      },
      services: entity.services.map(s => ({
        id: s.id,
        name: s.name,
        icon: s.icon,
        description: s.description
      }))
    } as WorkspacesResource;
  }
}
