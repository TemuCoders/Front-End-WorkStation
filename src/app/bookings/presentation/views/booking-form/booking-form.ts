import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchingApi } from '../../../../searching/infrastructure/searching-api';
import { BookingsApi } from '../../../infrastructure/bookings-api';
import { AuthService } from '../../../../User/infrastructure/auth.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css']
})
export class BookingFormPage {

  private route = inject(ActivatedRoute);
  private searchingApi = inject(SearchingApi);
  private bookingsApi = inject(BookingsApi);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  workspace: any = null;
  spaceId!: number;
  userId = this.auth.getUserId();

  total = 0;

  form = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.spaceId = Number(params['id']);
      console.log("📌 SPACE ID:", this.spaceId);

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
    this.searchingApi.getWorkspace(this.spaceId).subscribe({
      next: (ws) => {
        console.log("📌 WORKSPACE recibido:", ws);
        this.workspace = ws;
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
    if (this.form.invalid) return;

    const payload = {
      freelancerId: this.userId!,
      spaceId: this.spaceId,
      bookingDate: new Date().toISOString().split('T')[0],
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!
    };

    this.bookingsApi.createBooking(payload).subscribe({
      next: (res) => {
        // Redirigir a la lista
        this.router.navigate(['/bookings/list']);
      }
    });
  }
}
