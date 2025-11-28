import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Workspace } from '../domain/model/workspace.entity';
import { WorkspacesResource, WorkspacesResponse } from './workspaces-response';
import { Address } from '../domain/model/address.entity';

export class WorkspaceAssembler implements BaseAssembler<Workspace, WorkspacesResource, WorkspacesResponse> {

  /**
   * Convierte un WorkspacesResponse (que contiene un array workspaces)
   * a una lista de entidades Workspace.
   */
  toEntitiesFromResponse(response: WorkspacesResponse): Workspace[] {
    const resources = response.workspaces ?? [];
    return resources.map(r => this.toEntityFromResource(r));
  }

  /**
   * Convierte un WorkspacesResource (un workspace) a la entidad Workspace.
   */
  toEntityFromResource(resource: WorkspacesResource): Workspace {

    const address = new Address({
      street: resource.address.street,
      number: resource.address.number,
      city: resource.address.city,
      postalCode: resource.address.postalCode
    });

    return new Workspace({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      spaceType: resource.spaceType,
      capacity: resource.capacity,
      price: resource.price,
      available: resource.available,
      img: resource.img,
      address: address,
      ownerId: resource.ownerId
    });
  }

  /**
   * Convierte una entidad Workspace a WorkspacesResource (para envío al backend).
   */
  toResourceFromEntity(entity: Workspace): WorkspacesResource {

    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      spaceType: entity.spaceType,
      capacity: entity.capacity,
      price: entity.price,
      available: entity.available,
      img: entity.img,
      ownerId: entity.ownerId,
      address: {
        street: entity.address.street,
        number: entity.address.number,
        city: entity.address.city,
        postalCode: entity.address.postalCode
      }
    };
  }
}
