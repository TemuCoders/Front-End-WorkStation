import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {SearchingStore} from '../../../application/searching-store';
import {MatError} from '@angular/material/form-field';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-workspace-list',
  imports: [MatTableModule, TranslatePipe, MatButtonModule, MatError, MatProgressSpinner, MatIconModule],
  templateUrl: './workspace-list.html',
  styleUrl: './workspace-list.css'
})
export class WorkspaceList {
  readonly store = inject(SearchingStore);
  protected router = inject(Router);

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'type',
    'capacity',
    'pricePerDay',
    'isAvailable',
    'averageRating',
    'address',
    'owner',
    'services',
    'actions'
  ];

  editWorkspace(id: number): void {
    this.router.navigate(['searching/workspaces/edit', id]).then();
  }

  deleteWorkspace(id: number): void {
    this.store.deleteWorkspace(id);
  }

  getServicesNames(workspace: any): string {
    return workspace.services?.map((s: any) => s.name).join(', ') || '—';
  }

}
