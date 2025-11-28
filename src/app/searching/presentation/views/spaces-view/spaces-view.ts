import { Component, signal } from '@angular/core';
import { WorkspaceList } from '../../components/workspace-list/workspace-list';
import { SearchComponent } from '../../components/search-component/search-component'; 

@Component({
  selector: 'app-spaces-view',
  imports: [WorkspaceList, SearchComponent],
  templateUrl: './spaces-view.html',
  styleUrl: './spaces-view.css',
  standalone: true
})
export class SpacesView {
  searchQuery = signal<string>('');

  onSearchChange(term: string) {
    this.searchQuery.set(term);
  }
}