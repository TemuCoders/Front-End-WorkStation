import {Component, inject, signal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchingStore } from '../../../../searching/application/searching-store';
import { BookingResponse } from '../../../infrastructure/booking-response';
import { BookingFacade } from '../../../application/booking-facade.service';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
})
export class BookingFormPage {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(BookingFacade);
  private auth = inject(AuthService);
  private searchingStore = inject(SearchingStore);
  private fb = inject(FormBuilder);

  spaceId = signal<number | null>(null);
  userId = signal<number | null>(null);
  userName = signal<string>('');

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  workspace = signal<any>(null);

  ngOnInit() {
    // Workspace ID
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (!isNaN(id)) {
        this.spaceId.set(id);
        this.workspace.set(this.searchingStore.getWorkspaceById(id)());
      }
    });

    // User info
    const user = this.auth.currentUser();
    if (user) {
      this.userId.set(user.id);
      this.userName.set(user.name);
      this.form.patchValue({
        firstName: user.name.split(" ")[0] ?? '',
        lastName: user.name.split(" ")[1] ?? '',
        email: user.email ?? '',
      });
    }
  }

  submit() {
    console.log("FORM VALIDO:", this.form.valid);
    console.log("SPACE:", this.spaceId());
    console.log("USER:", this.userId());

    if (this.form.invalid || !this.spaceId() || !this.userId()) {
      console.warn("FORM INVALIDO");
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const payload = {
      freelancerId: this.userId()!,
      spaceId: this.spaceId()!,
      bookingDate: today,
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!,
    };

    console.log("POST →", payload);

    this.facade.createBooking(payload).subscribe({
      next: res => {
        console.log("RESPUESTA JSON-SERVER →", res);
        this.router.navigate(['/payments']);
      },
      error: err => console.error("ERROR DEL POST:", err)
    });
  }

}
