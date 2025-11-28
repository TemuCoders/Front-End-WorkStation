import { Injectable } from '@angular/core';
import {computed, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Workspace} from '../domain/model/workspace.entity';
import {SearchingApi} from '../infrastructure/searching-api';
import { Service } from '../domain/model/service.entity';

@Injectable({
  providedIn: 'root'
})
export class SearchingStore {
  private readonly workspacesSignal = signal<Workspace[]>([]);
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
   * Obtiene un workspace por su ID como Signal reactivo.
   * @param id - ID del workspace
   * @returns Signal con el Workspace encontrado o undefined
   */
  getWorkspaceById(id: number | null | undefined): Signal<Workspace | undefined> {
    return computed(() => id ? this.workspaces().find(w => w.id === id) : undefined);
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
  addWorkspace(workspace: Workspace): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.searchingApi.createWorkspace(workspace).pipe(retry(2)).subscribe({
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
  updateWorkspace(updated: Workspace): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.searchingApi.updateWorkspace(updated).pipe(retry(2)).subscribe({
      next: workspace => {
        this.workspacesSignal.update(list =>
          list.map(w => w.id === workspace.id ? workspace : w)
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
        this.workspacesSignal.update(list => list.filter(w => w.id !== id));
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
