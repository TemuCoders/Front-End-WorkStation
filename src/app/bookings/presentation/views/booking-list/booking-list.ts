import { Component, inject, OnInit, signal, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    // Obtener el ID del usuario desde AuthService
    const userId = this.auth.getUserId();

    console.log('👤 UserID obtenido:', userId);

    if (userId !== null) {
      this.userId = userId;
      console.log('📋 UserID establecido:', this.userId);
      this.loadBookings();
    } else {
      console.error('❌ No hay usuario logueado');
      this.loading = false;
    }
  }

  /** Cargar reservas del usuario actual */
  loadBookings(): void {
    console.log('🔄 Iniciando carga de bookings...');
    console.log('🌐 Estado inicial - loading:', this.loading);
    this.loading = true;

    this.bookingsApi.getAll().subscribe({
      next: (allBookings: any[]) => {
        console.log('📦 Total bookings en DB:', allBookings.length);
        console.log('📦 Todos los bookings:', allBookings);

        const userBookings = allBookings.filter(b => b.freelancerId === this.userId);
        console.log('✅ Bookings del usuario:', userBookings.length);

        if (userBookings.length === 0) {
          console.log('⚠️ No hay bookings para este usuario');
          this.bookings = [];
          this.loading = false;
          this.cdr.detectChanges();
          console.log('✅ Loading = false (sin bookings)');
          return;
        }

        // Cargar workspaces
        console.log('🔄 Iniciando carga de workspaces...');
        this.searchingApi.getWorkspaces().subscribe({
          next: (wsList: any[]) => {
            console.log('🏢 Workspaces cargados:', wsList.length);

            this.bookings = userBookings.map((b: any) => {
              const ws = wsList.find((w: any) => w.id === b.spaceId);

              if (!ws) {
                console.warn(`⚠️ No se encontró workspace con id ${b.spaceId}`);
              }

              const start = new Date(b.startDate);
              const end = new Date(b.endDate);

              const nights = Math.max(
                1,
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              );

              return {
                ...b,
                workspace: ws,
                total: nights * (ws?.price ?? 0)
              };
            });

            console.log('✅ Bookings procesados:', this.bookings);
            this.loading = false;
            console.log('✅ Loading = false (datos cargados)');

            this.cdr.detectChanges();

            setTimeout(() => {
              console.log('🔄 Estado final:', {
                loading: this.loading,
                bookingsLength: this.bookings.length
              });
            }, 100);
          },
          error: (err: any) => {
            console.error("❌ ERROR COMPLETO al cargar workspaces:", err);
            this.loading = false;
            this.cdr.detectChanges();
            console.log('✅ Loading = false (error workspaces)');
          }
        });
      },
      error: (err: any) => {
        console.error("❌ ERROR COMPLETO al cargar bookings:", err);
        this.loading = false;
        this.cdr.detectChanges();
        console.log('✅ Loading = false (error bookings)');
      }
    });
  }

  /** Formateo de fecha bonito */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }
}
