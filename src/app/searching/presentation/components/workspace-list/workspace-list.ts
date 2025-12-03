import { Component, inject, input, signal, computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchingStore } from '../../../application/searching-store';
import { WorkspaceFilters, WorkspaceFiltersComponent } from '../filter-component/filter-component';

@Component({
  selector: 'app-workspace-list',
  imports: [
    MatCardModule, 
    MatButtonModule, 
    MatError, 
    MatProgressSpinner, 
    TranslatePipe, 
    MatIconModule,
    WorkspaceFiltersComponent
  ],
  templateUrl: './workspace-list.html',
  styleUrl: './workspace-list.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceList {
  readonly store = inject(SearchingStore);
  protected router = inject(Router);

  searchQuery = input<string>('');
  
  // Signal para almacenar los filtros actuales
  currentFilters = signal<WorkspaceFilters>({
    minCapacity: 1,
    maxCapacity: 50,
    minPrice: 0,
    maxPrice: 500,
    spaceTypes: [],
    availableOnly: false
  });

  // Computed que aplica tanto la búsqueda como los filtros
  filteredWorkspaces = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filters = this.currentFilters();
    let workspaces = this.store.workspaces();

    // Aplicar búsqueda de texto
    if (query) {
      workspaces = workspaces.filter(workspace =>
        workspace.name.toLowerCase().includes(query) ||
        workspace.spaceType.toLowerCase().includes(query) ||
        workspace.address.toLowerCase().includes(query) ||
        workspace.description.toLowerCase().includes(query)
      );
    }

    // Aplicar filtros de capacidad
    workspaces = workspaces.filter(workspace => 
      workspace.capacity >= filters.minCapacity && 
      workspace.capacity <= filters.maxCapacity
    );

    // Aplicar filtros de precio
    workspaces = workspaces.filter(workspace => 
      workspace.price >= filters.minPrice && 
      workspace.price <= filters.maxPrice
    );

    // Aplicar filtro de tipo de espacio
    if (filters.spaceTypes.length > 0) {
      workspaces = workspaces.filter(workspace =>
        filters.spaceTypes.includes(workspace.spaceType)
      );
    }

    // Aplicar filtro de disponibilidad
    if (filters.availableOnly) {
      workspaces = workspaces.filter(workspace => workspace.available);
    }

    return workspaces;
  });

  // Método para actualizar los filtros
  onFiltersChange(filters: WorkspaceFilters): void {
    this.currentFilters.set(filters);
  }
}