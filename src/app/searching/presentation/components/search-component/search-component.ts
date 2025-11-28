import { Component, Output, EventEmitter, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-component',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatIcon,
    MatButtonModule,
    MatProgressSpinnerModule
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
      // Si está vacío, emite string vacío para mostrar todos
      this.searchTerm.emit('');
      return;
    }
    
    this.isSearching.set(true);
    this.searchValue.set(value);
    
    // Simula un pequeño delay para UX (opcional)
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
    
    // Si el usuario borra todo, limpia los resultados inmediatamente
    if (!value.trim()) {
      this.searchTerm.emit('');
    }
  }
}