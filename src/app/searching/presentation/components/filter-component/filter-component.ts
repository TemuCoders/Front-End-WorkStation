import { Component, output, signal, computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';

export interface WorkspaceFilters {
  minCapacity: number;
  maxCapacity: number;
  minPrice: number;
  maxPrice: number;
  spaceTypes: string[];
  availableOnly: boolean;
}

@Component({
  selector: 'app-workspace-filters',
  imports: [
    FormsModule,
    MatExpansionModule,
    MatSliderModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TranslatePipe
  ],
  templateUrl: './filter-component.html',
  styleUrl: './filter-component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceFiltersComponent {
  filtersChanged = output<WorkspaceFilters>();
  
  minCapacity = signal(1);
  maxCapacity = signal(50);
  minPrice = signal(0);
  maxPrice = signal(500);
  availableOnly = signal(false);
  
  availableSpaceTypes = [
    { value: 'Oficina Privada', label: 'Oficina Privada' },
    { value: 'Sala de Reuniones', label: 'Sala de Reuniones' },
    { value: 'Escritorio Dedicado', label: 'Escritorio Dedicado' },
    { value: 'Coworking', label: 'Espacio Coworking' },
    { value: 'Sala de Conferencias', label: 'Sala de Conferencias' }
  ];
  
  selectedSpaceTypes = signal<Set<string>>(new Set());

  activeFiltersCount = computed(() => {
    let count = 0;
    if (this.minCapacity() > 1) count++;
    if (this.maxCapacity() < 50) count++;
    if (this.minPrice() > 0) count++;
    if (this.maxPrice() < 500) count++;
    if (this.selectedSpaceTypes().size > 0) count++;
    if (this.availableOnly()) count++;
    return count;
  });

  formatCapacityLabel(value: number): string {
    return `${value} personas`;
  }

  formatPriceLabel(value: number): string {
    return `S/ ${value}`;
  }

  toggleSpaceType(type: string): void {
    const current = new Set(this.selectedSpaceTypes());
    if (current.has(type)) {
      current.delete(type);
    } else {
      current.add(type);
    }
    this.selectedSpaceTypes.set(current);
    this.emitFilters();
  }

  isSpaceTypeSelected(type: string): boolean {
    return this.selectedSpaceTypes().has(type);
  }

  onCapacityChange(): void {
    this.emitFilters();
  }

  onPriceChange(): void {
    this.emitFilters();
  }

  onAvailabilityChange(): void {
    this.emitFilters();
  }

  clearAllFilters(): void {
    this.minCapacity.set(1);
    this.maxCapacity.set(50);
    this.minPrice.set(0);
    this.maxPrice.set(500);
    this.selectedSpaceTypes.set(new Set());
    this.availableOnly.set(false);
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChanged.emit({
      minCapacity: this.minCapacity(),
      maxCapacity: this.maxCapacity(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      spaceTypes: Array.from(this.selectedSpaceTypes()),
      availableOnly: this.availableOnly()
    });
  }
}