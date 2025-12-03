import { Component, Output, EventEmitter, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatIcon,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe
  ],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {
  @Output() searchTerm = new EventEmitter<string>();
  
  searchValue = signal('');
  isSearching = signal(false);
  
  onSearch(value: string) {
    if (!value.trim()) {

      this.searchTerm.emit('');
      return;
    }
    
    this.isSearching.set(true);
    this.searchValue.set(value);
    
  
    setTimeout(() => {
      this.searchTerm.emit(value.trim());
      this.isSearching.set(false);
    }, 300);
  }
  
  onClear() {
    this.searchValue.set('');
    this.searchTerm.emit('');
  }
  
  onInputChange(value: string) {
    this.searchValue.set(value);
    
    if (!value.trim()) {
      this.searchTerm.emit('');
    }
  }
}