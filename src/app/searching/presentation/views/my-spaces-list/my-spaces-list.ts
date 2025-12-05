import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { SearchingApi } from '../../../infrastructure/searching-api';
import { WorkspaceMinimalResource } from '../../../infrastructure/workspace-minimal.resource';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-my-spaces-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    Sidebar,
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './my-spaces-list.html',
  styleUrls: ['./my-spaces-list.css']
})
export class MySpacesListComponent implements OnInit {
  private authService = inject(AuthService);
  private searchingApi = inject(SearchingApi);
  private router = inject(Router);

  mySpaces = signal<WorkspaceMinimalResource[]>([]);
  loading = signal(true);
  ownerId = signal<number | null>(null);
  
  // ✅ Para edición inline
  editingSpaceId = signal<number | null>(null);
  editForm = signal<any>(null);

  ngOnInit(): void {
    // ✅ VALIDACIÓN: Solo owners pueden ver esta página
    if (!this.authService.isOwner()) {
      console.error('❌ Usuario no es owner');
      alert('Solo los propietarios pueden acceder a esta sección');
      this.router.navigate(['/']);
      return;
    }

    const ownerId = this.authService.getOwnerId();
    if (!ownerId) {
      console.error('❌ No se encontró el Owner ID');
      alert('Error al cargar tu perfil de propietario');
      this.router.navigate(['/login']);
      return;
    }

    this.ownerId.set(ownerId);
    console.log('✅ Owner ID:', ownerId);
    this.loadMySpaces();
  }

  loadMySpaces(): void {
    const ownerId = this.ownerId();
    if (!ownerId) return;

    console.log('🔄 Cargando espacios del owner:', ownerId);
    this.loading.set(true);

    this.searchingApi.getWorkspaces().subscribe({
      next: (allSpaces) => {
        console.log('📦 Total espacios en DB:', allSpaces.length);
        
        // ✅ Filtrar solo los espacios del owner actual
        const ownerSpaces = allSpaces.filter(space => space.ownerId === ownerId);
        
        console.log('✅ Espacios del owner:', ownerSpaces.length);
        console.log('📋 Mis espacios:', ownerSpaces);
        
        this.mySpaces.set(ownerSpaces);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando espacios:', err);
        alert('Error al cargar tus espacios');
        this.loading.set(false);
      }
    });
  }

  createNewSpace(): void {
    this.router.navigate(['/my-spaces/create']);
  }

  // ✅ Edición inline
  startEdit(space: WorkspaceMinimalResource): void {
    this.editingSpaceId.set(space.spaceId);
    
    // Parsear address para obtener los campos individuales
    const addressParts = this.parseAddress(space.address);
    
    this.editForm.set({
      name: space.name,
      spaceType: space.spaceType,
      capacity: space.capacity,
      description: space.description,
      price: space.price,
      available: space.available,
      images: [...space.images],
      ...addressParts
    });
  }

  cancelEdit(): void {
    this.editingSpaceId.set(null);
    this.editForm.set(null);
  }

  saveEdit(spaceId: number): void {
    const form = this.editForm();
    const ownerId = this.ownerId();
    
    if (!form || !ownerId) return;

    console.log('💾 Guardando cambios del espacio:', spaceId);

    const updateRequest = {
      spaceId: spaceId,
      ownerId: ownerId,
      name: form.name,
      spaceType: form.spaceType,
      capacity: Number(form.capacity),
      description: form.description,
      price: Number(form.price),
      available: form.available,
      street: form.street,
      streetNumber: form.streetNumber,
      city: form.city,
      postalCode: form.postalCode,
      images: form.images
    };

    this.searchingApi.updateWorkspace(spaceId, updateRequest).subscribe({
      next: () => {
        console.log('✅ Espacio actualizado');
        alert('Espacio actualizado exitosamente');
        this.cancelEdit();
        this.loadMySpaces();
      },
      error: (err) => {
        console.error('❌ Error actualizando espacio:', err);
        alert('Error al actualizar el espacio');
      }
    });
  }

  // Helper para parsear address
  private parseAddress(address: string): any {
    // Formato esperado: "Calle 123, Ciudad, Código"
    // Este es un parser básico, ajusta según tu formato
    const parts = address.split(',').map(p => p.trim());
    
    return {
      street: parts[0]?.split(' ').slice(0, -1).join(' ') || '',
      streetNumber: parts[0]?.split(' ').pop() || '',
      city: parts[1] || '',
      postalCode: parts[2] || ''
    };
  }

  viewSpaceBookings(spaceId: number): void {
    this.router.navigate(['/my-spaces', spaceId, 'bookings']);
  }

  deleteSpace(spaceId: number, spaceName: string): void {
    const confirmed = confirm(`¿Estás seguro de eliminar "${spaceName}"? Esta acción no se puede deshacer.`);
    
    if (!confirmed) return;

    console.log('🗑️ Eliminando espacio:', spaceId);

    this.searchingApi.deleteWorkspace(spaceId).subscribe({
      next: () => {
        console.log('✅ Espacio eliminado');
        alert('Espacio eliminado exitosamente');
        // Recargar la lista
        this.loadMySpaces();
      },
      error: (err) => {
        console.error('❌ Error eliminando espacio:', err);
        alert('Error al eliminar el espacio');
      }
    });
  }

  toggleAvailability(space: WorkspaceMinimalResource): void {
    console.log('🔄 Cambiando disponibilidad del espacio:', space.spaceId);
    
    const addressParts = this.parseAddress(space.address);
    
    const updateRequest = {
      spaceId: space.spaceId,
      ownerId: this.ownerId()!,
      name: space.name,
      description: space.description,
      spaceType: space.spaceType,
      capacity: space.capacity,
      price: space.price,
      available: !space.available,
      images: space.images,
      ...addressParts
    };

    this.searchingApi.updateWorkspace(space.spaceId, updateRequest).subscribe({
      next: () => {
        console.log('✅ Disponibilidad actualizada');
        this.loadMySpaces();
      },
      error: (err) => {
        console.error('❌ Error actualizando disponibilidad:', err);
        alert('Error al actualizar la disponibilidad');
      }
    });
  }

  getMainImage(images: string[]): string {
    return images && images.length > 0 
      ? images[0] 
      : 'https://via.placeholder.com/400x300?text=No+Image';
  }
}