import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Workspace} from '../domain/model/workspace.entity';
import {WorkspacesResource, WorkspacesResponse} from './workspaces-response';
import {WorkspaceAssembler} from './workspace-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class WorkspacesApiEndpoint extends BaseApiEndpoint<Workspace, WorkspacesResource, WorkspacesResponse, WorkspaceAssembler>{
  /**
   * Creates an instance of CoursesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderWorkspacesEndpointPath}`,
      new WorkspaceAssembler());
  }
}
