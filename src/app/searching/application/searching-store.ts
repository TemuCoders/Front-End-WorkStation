import { Injectable } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { WorkspaceMinimalResource } from '../infrastructure/workspace-minimal.resource';
import { CreateWorkspaceRequest } from '../infrastructure/create-workspace.request';
import { UpdateWorkspaceRequest } from '../infrastructure/update-workspace.request';
import { SearchingApi } from '../infrastructure/searching-api';

@Injectable({
  providedIn: 'root'
})
export class SearchingStore {
  private readonly workspacesSignal = signal<WorkspaceMinimalResource[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly workspaces = this.workspacesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly workspaceCount = computed(() => this.workspaces().length);

  constructor(private searchingApi: SearchingApi) {
    this.loadWorkspaces();
  }

  /**
   * Obtiene un workspace por su ID
   */
  getWorkspaceById(id: number | null | undefined): Signal<WorkspaceMinimalResource | undefined> {
    return computed(() => id ? this.workspaces().find(w => w.spaceId === id) : undefined);
  }

  /**
   * Carga todos los workspaces desde el API.
   */
  private loadWorkspaces(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.searchingApi.getWorkspaces().pipe(takeUntilDestroyed()).subscribe({
      next: workspaces => {
        this.workspacesSignal.set(workspaces);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load workspaces'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Crea un nuevo workspace.
   */
  addWorkspace(request: CreateWorkspaceRequest): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.searchingApi.createWorkspace(request).pipe(retry(2)).subscribe({
      next: created => {
        this.workspacesSignal.update(list => [...list, created]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create workspace'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Actualiza un workspace existente.
   */
  updateWorkspace(id: number, request: UpdateWorkspaceRequest): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.searchingApi.updateWorkspace(id, request).pipe(retry(2)).subscribe({
      next: workspaceComplete => {
        // El backend devuelve WorkspaceResource (completo)
        // Convertimos a minimal para actualizar la lista
        const minimal: WorkspaceMinimalResource = {
          spaceId: workspaceComplete.spaceId,
          name: workspaceComplete.name,
          ownerId: workspaceComplete.ownerId,
          spaceType: workspaceComplete.spaceType,
          capacity: workspaceComplete.capacity,
          price: workspaceComplete.price,
          description: workspaceComplete.description,
          available: workspaceComplete.available,
          address: `${workspaceComplete.street} ${workspaceComplete.streetNumber}, ${workspaceComplete.city}`,
          images: workspaceComplete.images
        };

        this.workspacesSignal.update(list =>
          list.map(w => w.spaceId === minimal.spaceId ? minimal : w)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update workspace'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Elimina un workspace por ID.
   */
  deleteWorkspace(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.searchingApi.deleteWorkspace(id).pipe(retry(2)).subscribe({
      next: () => {
        this.workspacesSignal.update(list => list.filter(w => w.spaceId !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete workspace'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Formatea mensajes de error para mostrar en UI.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}