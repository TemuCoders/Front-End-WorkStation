import { Component, inject, OnInit, signal, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingApiEndpoint } from '../../../infrastructure/booking-api-endpoint';
import { SearchingApi } from '../../../../searching/infrastructure/searching-api';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { UserStore } from '../../../../User/application/User-store'; 
import { UserResource } from '../../../../User/infrastructure/resources';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, Sidebar, MatIcon],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.css']
})
export class BookingListPage implements OnInit {
  private userStore = inject(UserStore);
  private bookingsApi = inject(BookingApiEndpoint);
  private searchingApi = inject(SearchingApi);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  readonly currentUser = signal<UserResource | undefined>(undefined);
  constructor() {
      effect(() => {
        const users = this.userStore.users();
        const found = users.find(u => u.id === this.userId);
        this.currentUser.set(found);
      });
  }

  bookings: any[] = [];
  loading: boolean = true;
  userId: number | null = null;

  ngOnInit(): void {
  const isFreelancer = this.auth.isFreelancer();
  const isOwner = this.auth.isOwner();

  if (!isFreelancer && !isOwner) {
    console.error('❌ Usuario no es freelancer ni owner');
    alert('No tienes permisos para ver reservas');
    this.router.navigate(['/']);
    return;
  }

  if (isFreelancer) {
    this.loadFreelancerBookings();
  } else if (isOwner) {
    this.loadOwnerBookings();
  }
}

/** Cargar reservas del freelancer actual */
loadFreelancerBookings(): void {
  const freelancerId = this.auth.getFreelancerId();

  console.log('👤 FreelancerID obtenido:', freelancerId);

  if (freelancerId === null) {
    console.error('❌ No se encontró el freelancer ID');
    alert('Error al cargar tu perfil de freelancer');
    this.loading = false;
    this.router.navigate(['/login']);
    return;
  }

  this.userId = freelancerId; 
  console.log('📋 FreelancerID establecido:', freelancerId);
  this.loadBookingsForFreelancer(freelancerId);
}

/** Cargar reservas de los espacios del owner */
loadOwnerBookings(): void {
  const ownerId = this.auth.getOwnerId();

  console.log('👤 OwnerID obtenido:', ownerId);

  if (ownerId === null) {
    console.error('❌ No se encontró el owner ID');
    alert('Error al cargar tu perfil de propietario');
    this.loading = false;
    this.router.navigate(['/login']);
    return;
  }

  console.log('🔄 Cargando espacios del owner...');
  this.loading = true;

  // Primero obtener los espacios del owner
  this.searchingApi.getWorkspaces().subscribe({
    next: (allSpaces) => {
      const ownerSpaces = allSpaces.filter(s => s.ownerId === ownerId);
      const ownerSpaceIds = ownerSpaces.map(s => s.spaceId);
      
      console.log('🏢 Espacios del owner:', ownerSpaceIds);

      if (ownerSpaceIds.length === 0) {
        console.log('⚠️ El owner no tiene espacios registrados');
        this.bookings = [];
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      // Ahora cargar bookings de esos espacios
      this.loadBookingsForOwnerSpaces(ownerSpaceIds);
    },
    error: (err) => {
      console.error('❌ Error cargando espacios:', err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

/** Cargar bookings del freelancer */
private loadBookingsForFreelancer(freelancerId: number): void {
  this.bookingsApi.getAll().subscribe({
    next: (allBookings: any[]) => {
      console.log('📦 Total bookings en DB:', allBookings.length);

      const freelancerBookings = allBookings.filter(b => b.freelancerId === freelancerId);
      console.log('✅ Bookings del freelancer:', freelancerBookings.length);

      if (freelancerBookings.length === 0) {
        this.bookings = [];
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.processBookings(freelancerBookings);
    },
    error: (err) => {
      console.error('❌ Error cargando bookings:', err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

/** Cargar bookings filtrados por spaceIds del owner */
private loadBookingsForOwnerSpaces(ownerSpaceIds: number[]): void {
  console.log('🔄 Cargando bookings de los espacios del owner...');

  this.bookingsApi.getAll().subscribe({
    next: (allBookings: any[]) => {
      console.log('📦 Total bookings en DB:', allBookings.length);

      // ✅ Filtrar bookings que pertenecen a espacios del owner
      const ownerBookings = allBookings.filter(b => ownerSpaceIds.includes(b.spaceId));
      
      console.log('✅ Bookings de los espacios del owner:', ownerBookings.length);

      if (ownerBookings.length === 0) {
        this.bookings = [];
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.processBookings(ownerBookings);
    },
    error: (err) => {
      console.error('❌ Error cargando bookings:', err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

/** Procesar bookings y cargar workspaces */
private processBookings(bookingsToProcess: any[]): void {
  this.searchingApi.getWorkspaces().subscribe({
    next: (wsList: any[]) => {
      console.log('🏢 Workspaces cargados:', wsList.length);

      this.bookings = bookingsToProcess.map((b: any) => {
        const ws = wsList.find((w: any) => w.spaceId === b.spaceId);

        if (!ws) {
          console.warn(`⚠️ No se encontró workspace con spaceId ${b.spaceId}`);
        } else {
          console.log(`✅ Workspace encontrado:`, ws.name);
        }

        const start = new Date(b.startDate);
        const end = new Date(b.endDate);

        const nights = Math.max(
          1,
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        );

        return {
          ...b,
          workspace: ws,
          nights: nights,
          total: nights * (ws?.price ?? 0),
          image: ws?.images?.[0]?.url ?? 'assets/default-image.jpg'
        };
      });

      console.log('✅ Bookings procesados:', this.bookings);
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error("❌ ERROR al cargar workspaces:", err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}
}
