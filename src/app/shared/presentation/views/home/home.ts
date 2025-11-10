import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import { Workspace } from '../../../../searching/domain/model/workspace.entity';
import { SearchingStore } from '../../../../searching/application/searching-store';
import { Router } from '@angular/router';
import { input, InputSignal } from '@angular/core';
import { inject } from '@angular/core';


@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  readonly store = inject(SearchingStore);
  protected router = inject(Router);
  workspace: InputSignal<Workspace> = input.required<Workspace>();

  getServicesNames(workspace: any): string {
    return workspace.services?.map((s: any) => s.name).join(', ') || '—';
  }
}
