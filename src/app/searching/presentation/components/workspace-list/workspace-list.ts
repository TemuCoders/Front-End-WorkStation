import { Component, inject, input, computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchingStore } from '../../../application/searching-store';

@Component({
  selector: 'app-workspace-list',
  imports: [
    MatCardModule, 
    MatButtonModule, 
    MatError, 
    MatProgressSpinner, 
    TranslatePipe, 
    MatIconModule
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

  filteredWorkspaces = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      return this.store.workspaces(); 
    }

    return this.store.workspaces().filter(workspace => {
      // ✅ workspace.address es un string, no un objeto
      return (
        workspace.name.toLowerCase().includes(query) ||
        workspace.spaceType.toLowerCase().includes(query) ||
        workspace.address.toLowerCase().includes(query) ||
        workspace.description.toLowerCase().includes(query)
      );
    });
  });

  // ❌ ELIMINAR - WorkspaceMinimalResource no tiene services
  // getServicesNames(workspace: any): string {
  //   return workspace.services?.map((s: any) => s.name).join(', ') || '—';
  // }
}