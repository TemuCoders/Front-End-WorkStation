import { Component, inject, OnInit, signal,ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingApiEndpoint } from '../../../infrastructure/booking-api-endpoint';
import { SearchingApi } from '../../../../searching/infrastructure/searching-api';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { UserStore } from '../../../../User/application/User-store'; 
import { User } from '../../../../User/domain/model/user.entity';

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

  readonly currentUser = signal<User | undefined>(undefined);
  constructor() {
      // Efecto para obtener el usuario actual
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
    // Obtener el usuario desde localStorage
    const user = this.auth.getUser();

    console.log('👤 Usuario obtenido:', user);

    if (user && user.id) {
      this.userId = user.id;
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

            // FORZAR detección de cambios
            this.cdr.detectChanges();

            // Verificar estado final
            setTimeout(() => {
              console.log('🔄 Estado final:', {
                loading: this.loading,
                bookingsLength: this.bookings.length
              });
            }, 100);
          },
          error: (err: any) => {
            console.error("❌ ERROR COMPLETO al cargar workspaces:", err);
            console.error("❌ Error type:", err.constructor.name);
            console.error("❌ Error status:", err.status);
            console.error("❌ Error message:", err.message);
            this.loading = false;
            this.cdr.detectChanges();
            console.log('✅ Loading = false (error workspaces)');
          }
        });
      },
      error: (err: any) => {
        console.error("❌ ERROR COMPLETO al cargar bookings:", err);
        console.error("❌ Error type:", err.constructor.name);
        console.error("❌ Error status:", err.status);
        console.error("❌ Error message:", err.message);
        console.error("❌ Error URL:", err.url);
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
