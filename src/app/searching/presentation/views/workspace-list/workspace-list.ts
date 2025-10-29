import {Component, inject} from '@angular/core';
import {input, InputSignal} from '@angular/core';
import {Workspace} from '../../../domain/model/workspace.entity';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatError} from '@angular/material/form-field';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {SearchingStore} from '../../../application/searching-store';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-workspace-list',
  imports: [MatCardModule, MatButtonModule, MatError, MatProgressSpinner, TranslatePipe, MatIconModule],
  templateUrl: './workspace-list.html',
  styleUrl: './workspace-list.css',
  standalone:true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceList {
  readonly store = inject(SearchingStore);
  protected router = inject(Router);
  workspace: InputSignal<Workspace> = input.required<Workspace>();

  getServicesNames(workspace: any): string {
    return workspace.services?.map((s: any) => s.name).join(', ') || '—';
  }

}


