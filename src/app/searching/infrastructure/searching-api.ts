import { Injectable } from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {HttpClient} from '@angular/common/http';
import {WorkspacesApiEndpoint} from './workspaces-api-endpoint';
import {Observable} from 'rxjs';
import {Workspace} from '../domain/model/workspace.entity';

@Injectable({
  providedIn: 'root'
})
export class SearchingApi extends BaseApi{
  private readonly workspacesEndpoint: WorkspacesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.workspacesEndpoint = new WorkspacesApiEndpoint(http);
  }

  /**
   * Retrieves all workspaces from the API.
   * @returns An Observable for an array of Workspace entities.
   */
  getWorkspaces(): Observable<Workspace[]> {
    return this.workspacesEndpoint.getAll();
  }

  /**
   * Retrieves a single workspace by its ID.
   * @param id - The ID of the workspace.
   * @returns An Observable for the Workspace entity.
   */
  getWorkspace(id: number): Observable<Workspace> {
    return this.workspacesEndpoint.getById(id);
  }

  /**
   * Creates a new workspace in the API.
   * @param workspace - The workspace entity to create.
   * @returns An Observable for the created Workspace.
   */
  createWorkspace(workspace: Workspace): Observable<Workspace> {
    return this.workspacesEndpoint.create(workspace);
  }

  /**
   * Updates an existing workspace in the API.
   * @param workspace - The workspace entity to update.
   * @returns An Observable for the updated Workspace.
   */
  updateWorkspace(workspace: Workspace): Observable<Workspace> {
    return this.workspacesEndpoint.update(workspace, workspace.id);
  }

  /**
   * Deletes a workspace by its ID.
   * @param id - The ID of the workspace to delete.
   * @returns An Observable of void.
   */
  deleteWorkspace(id: number): Observable<void> {
    return this.workspacesEndpoint.delete(id);
  }
}
