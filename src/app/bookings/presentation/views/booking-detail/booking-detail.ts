import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingApiEndpoint } from '../../../infrastructure/booking-api-endpoint';
import { SearchingApi } from '../../../../searching/infrastructure/searching-api';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { DatePipe, NgIf } from '@angular/common';
import { WorkspaceResource } from '../../../../searching/infrastructure/workspace-resource';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  templateUrl: './booking-detail.html',
  styleUrls: ['./booking-detail.css'],
  imports: [
    DatePipe,
    NgIf  
  ],
})
export class BookingDetailPage implements OnInit {  

  private route = inject(ActivatedRoute);
  private api = inject(BookingApiEndpoint);
  private searchingApi = inject(SearchingApi);
  private router = inject(Router);
  private auth = inject(AuthService);

  bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));

  booking: any;
  workspace: WorkspaceResource | null = null;
  loading = true;
  error = false;

  ngOnInit() {
    if (!this.auth.isFreelancer()) {
      console.error('❌ Usuario no es freelancer');
      alert('Solo los freelancers pueden ver detalles de reservas');
      this.router.navigate(['/']);
      return;
    }

    if (!this.bookingId || isNaN(this.bookingId)) {
      console.error('❌ ID de booking inválido');
      this.router.navigate(['/bookings/list']);
      return;
    }

    this.loadBookingDetail();
  }

  loadBookingDetail() {
    console.log('📋 Cargando booking:', this.bookingId);
    
    this.api.getBooking(this.bookingId).subscribe({
      next: (b) => {
        console.log('✅ Booking recibido:', b);
        
        const freelancerId = this.auth.getFreelancerId();
        if (b.freelancerId !== freelancerId) {
          console.error('❌ Este booking no pertenece al freelancer actual');
          alert('No tienes permiso para ver este booking');
          this.router.navigate(['/bookings/list']);
          return;
        }

        this.booking = b;
        
        // Cargar el workspace asociado
        this.searchingApi.getWorkspaceById(b.spaceId).subscribe({
          next: (ws) => {
            console.log('🏢 Workspace cargado:', ws);
            this.workspace = ws;
            this.loading = false;
          },
          error: (err) => {
            console.error('❌ Error cargando workspace:', err);
            this.error = true;
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('❌ Error cargando booking:', err);
        this.error = true;
        this.loading = false;
        alert('Error al cargar la reserva');
        this.router.navigate(['/bookings/list']);
      }
    });
  }

  goToPayment() {
    if (!this.booking) {
      console.error('❌ No hay booking para procesar pago');
      return;
    }

    console.log('💳 Navegando a payment:', this.bookingId);
    this.router.navigate(['/payments', this.bookingId]);
  }

  goBack() {
    this.router.navigate(['/bookings/list']);
  }

  calculateNights(): number {
    if (!this.booking) return 0;
    
    const start = new Date(this.booking.startDate);
    const end = new Date(this.booking.endDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.max(1, Math.ceil(diff));
  }

  calculateTotal(): number {
    if (!this.booking || !this.workspace) return 0;
    
    return this.calculateNights() * this.workspace.price;
  }
}