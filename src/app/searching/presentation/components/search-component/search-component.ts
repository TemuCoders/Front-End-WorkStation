import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search-component',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatIcon],
  templateUrl: './search-component.html',
  styleUrl: './search-component.css'
})
export class SearchComponent {
  onSearch(value: string) {
    console.log('Buscando:', value);
    
  }

}
