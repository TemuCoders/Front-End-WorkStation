import { Component } from '@angular/core';
import { WorkspaceList } from '../../components/workspace-list/workspace-list';
import { Workspace } from '../../../domain/model/workspace.entity';
import { Input } from '@angular/core';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../../components/search-component/search-component'; 

@Component({
  selector: 'app-spaces-view',
  imports: [WorkspaceList, SearchComponent,MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './spaces-view.html',
  styleUrl: './spaces-view.css'
})
export class SpacesView {
  @Input({ required: true }) workspace!: Workspace;

    
}
