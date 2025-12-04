import { Component, inject, OnInit, signal, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingApiEndpoint } from '../../../infrastructure/booking-api-endpoint';
import { SearchingApi } from '../../../../searching/infrastructure/searching-api';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { UserStore } from '../../../../User/application/User-store'; 
import { UserResource } from '../../../../User/infrastructure/resources';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, Sidebar],
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
  
  bookings: any[] = [];
  loading: boolean = true;
  freelancerId: number | null = null;

  constructor() {
    effect(() => {
      const users = this.userStore.users();
      const currentAuthUser = this.auth.currentUser();
      if (currentAuthUser) {
        const found = users.find(u => u.id === currentAuthUser.id);
        this.currentUser.set(found);
      }
    });
  }

  ngOnInit(): void {
    if (!this.auth.isFreelancer()) {
      console.error('❌ Usuario no es freelancer');
      alert('Solo los freelancers pueden ver reservas');
      this.router.navigate(['/']);
      return;
    }

    const freelancerId = this.auth.getFreelancerId();

    console.log('👤 FreelancerID obtenido:', freelancerId);

    if (freelancerId !== null) {
      this.freelancerId = freelancerId;
      console.log('📋 FreelancerID establecido:', this.freelancerId);
      this.loadBookings();
    } else {
      console.error('❌ No se encontró el freelancer ID');
      alert('Error al cargar tu perfil de freelancer');
      this.loading = false;
      this.router.navigate(['/login']);
    }
  }

  loadBookings(): void {
    console.log('🔄 Iniciando carga de bookings...');
    console.log('🔍 Buscando bookings del freelancerId:', this.freelancerId);
    this.loading = true;

    this.bookingsApi.getAll().subscribe({
      next: (allBookings: any[]) => {
        console.log('📦 Total bookings en DB:', allBookings.length);
        console.log('📦 Todos los bookings:', allBookings);

        // ✅ CORREGIDO: Filtrar por freelancerId
        const freelancerBookings = allBookings.filter(b => b.freelancerId === this.freelancerId);
        console.log('✅ Bookings del freelancer:', freelancerBookings.length);
        console.log('📋 Bookings filtrados:', freelancerBookings);

        if (freelancerBookings.length === 0) {
          console.log('⚠️ No hay bookings para este freelancer');
          this.bookings = [];
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        // Cargar workspaces
        console.log('🔄 Iniciando carga de workspaces...');
        this.searchingApi.getWorkspaces().subscribe({
          next: (wsList: any[]) => {
            console.log('🏢 Workspaces cargados:', wsList.length);
            console.log('📋 Ejemplo de workspace:', wsList[0]); 

            this.bookings = freelancerBookings.map((b: any) => {
              const ws = wsList.find((w: any) => w.spaceId === b.spaceId);

              if (!ws) {
                console.warn(`⚠️ No se encontró workspace con spaceId ${b.spaceId}`);
                console.log('🔍 Workspace buscado:', b.spaceId);
                console.log('📦 Workspaces disponibles:', wsList.map(w => ({ spaceId: w.spaceId, name: w.name })));
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
                total: nights * (ws?.price ?? 0)
              };
            });

            console.log('✅ Bookings procesados:', this.bookings);
            this.loading = false;
            this.cdr.detectChanges();

            setTimeout(() => {
              console.log('🔄 Estado final:', {
                loading: this.loading,
                bookingsLength: this.bookings.length,
                freelancerId: this.freelancerId
              });
            }, 100);
          },
          error: (err: any) => {
            console.error("❌ ERROR al cargar workspaces:", err);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err: any) => {
        console.error("❌ ERROR al cargar bookings:", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** Formateo de fecha */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  /** Navegar al detalle del booking */
  viewBooking(bookingId: number): void {
    this.router.navigate(['/bookings', bookingId]);
  }
}