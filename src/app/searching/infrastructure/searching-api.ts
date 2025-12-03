import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkspaceMinimalResource } from './workspace-minimal.resource';
import { WorkspaceResource } from './workspace-resource';
import { CreateWorkspaceRequest } from './create-workspace.request';
import { UpdateWorkspaceRequest } from './update-workspace.request';

@Injectable({
  providedIn: 'root'
})
export class SearchingApi {
  private baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderWorkspacesEndpointPath}`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/v1/spaces
   * @returns Lista de workspaces (minimal)
   */
  getWorkspaces(): Observable<WorkspaceMinimalResource[]> {
    return this.http.get<WorkspaceMinimalResource[]>(this.baseUrl);
  }

  /**
   * GET /api/v1/spaces/{id}
   * @returns Workspace completo
   */
  getWorkspaceById(id: number): Observable<WorkspaceResource> {
    return this.http.get<WorkspaceResource>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /api/v1/spaces/{ownerId}/owner
   * @returns Lista de workspaces por owner
   */
  getWorkspacesByOwnerId(ownerId: number): Observable<WorkspaceMinimalResource[]> {
    return this.http.get<WorkspaceMinimalResource[]>(`${this.baseUrl}/${ownerId}/owner`);
  }

  /**
   * POST /api/v1/spaces
   * @returns Workspace creado (minimal)
   */
  createWorkspace(request: CreateWorkspaceRequest): Observable<WorkspaceMinimalResource> {
    return this.http.post<WorkspaceMinimalResource>(this.baseUrl, request);
  }

  /**
   * PUT /api/v1/spaces/{id}
   * @returns Workspace actualizado (completo)
   */
  updateWorkspace(id: number, request: UpdateWorkspaceRequest): Observable<WorkspaceResource> {
    return this.http.put<WorkspaceResource>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * DELETE /api/v1/spaces/{id}
   * @returns void (204 No Content)
   */
  deleteWorkspace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}