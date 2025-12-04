import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchingApi } from '../../../../searching/infrastructure/searching-api';
import { BookingApiEndpoint } from '../../../infrastructure/booking-api-endpoint';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { WorkspaceResource } from '../../../../searching/infrastructure/workspace-resource';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css']
})
export class BookingFormPage implements OnInit {

  private route = inject(ActivatedRoute);
  private searchingApi = inject(SearchingApi);
  private bookingsApi = inject(BookingApiEndpoint);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  workspace: WorkspaceResource | null = null;
  spaceId!: number;
  
  freelancerId = this.auth.getFreelancerId();
  
  total = 0;

  form = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  ngOnInit() {
    if (!this.auth.isFreelancer()) {
      console.error("❌ Usuario no es freelancer");
      alert("Solo los freelancers pueden crear reservas");
      this.router.navigate(['/']);
      return;
    }

    if (!this.freelancerId) {
      console.error("❌ No se encontró el Freelancer ID");
      alert("Error al cargar tu perfil de freelancer. Intenta iniciar sesión nuevamente.");
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe((params: any) => {
      this.spaceId = Number(params['id']);
      console.log("📌 SPACE ID:", this.spaceId);
      console.log("✅ FREELANCER ID:", this.freelancerId);

      if (!this.spaceId || isNaN(this.spaceId)) {
        console.error("❌ ID inválido, redirigiendo...");
        this.router.navigate(['/searching']);
        return;
      }

      this.loadWorkspace();
    });

    this.form.valueChanges.subscribe(() => this.calculateTotal());
  }

  loadWorkspace() {
    this.searchingApi.getWorkspaceById(this.spaceId).subscribe({  
      next: (ws) => {
        console.log("📌 WORKSPACE recibido:", ws);
        this.workspace = ws;
      },
      error: (err) => {
        console.error("❌ Error cargando workspace:", err);
        alert("No se pudo cargar el espacio de trabajo");
        this.router.navigate(['/searching']);
      }
    });
  }

  calculateTotal() {
    if (!this.workspace) return;

    const start = this.form.value.startDate;
    const end = this.form.value.endDate;

    if (!start || !end) {
      this.total = 0;
      return;
    }

    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);

    this.total = Math.max(1, diff) * this.workspace.price;
  }

  submit() {
    if (this.form.invalid) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (!this.freelancerId) {
      console.error("❌ No hay freelancerId disponible");
      alert("Error: No se pudo identificar tu perfil de freelancer");
      return;
    }

    const payload = {
      freelancerId: this.freelancerId,  
      spaceId: this.spaceId,
      bookingDate: new Date().toISOString().split('T')[0],
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!
    };

    console.log("📤 Enviando booking:", payload);

    this.bookingsApi.create(payload).subscribe({
      next: (res) => {
        console.log("✅ Booking creado:", res);
        alert("¡Reserva creada exitosamente!");
        this.router.navigate(['/bookings/list']);
      },
      error: (err) => {
        console.error("❌ Error creando booking:", err);
        alert("Error al crear la reserva. Intenta nuevamente.");
      }
    });
  }
}