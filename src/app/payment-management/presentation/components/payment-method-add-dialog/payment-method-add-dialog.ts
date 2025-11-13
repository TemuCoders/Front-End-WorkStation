import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentMethodFacade } from '../../../application/payment-method-facade.service';

@Component({
  selector: 'app-payment-method-add-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './payment-method-add-dialog.html',
  styleUrl: './payment-method-add-dialog.css'
})
export class PaymentMethodAddDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PaymentMethodAddDialogComponent>);
  private facade = inject(PaymentMethodFacade);

  form = this.fb.group({
    type: ['CARD', Validators.required],
    maskedPan: [''],
    expMonth: [null as number | null],
    expYear: [null as number | null]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { userId: number }) {}

  onTypeChange(): void {
    const type = this.form.value.type;
    if (type === 'CARD') {
      this.form.get('maskedPan')?.setValidators([Validators.required]);
      this.form.get('expMonth')?.setValidators([Validators.required, Validators.min(1), Validators.max(12)]);
      this.form.get('expYear')?.setValidators([Validators.required, Validators.min(2025)]);
    } else {
      this.form.get('maskedPan')?.clearValidators();
      this.form.get('expMonth')?.clearValidators();
      this.form.get('expYear')?.clearValidators();
    }
    this.form.get('maskedPan')?.updateValueAndValidity();
    this.form.get('expMonth')?.updateValueAndValidity();
    this.form.get('expYear')?.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.valid) {
      const payload: any = {
        userId: this.data.userId,
        type: this.form.value.type!
      };

      if (this.form.value.type === 'CARD') {
        payload.maskedPan = this.form.value.maskedPan;
        payload.expMonth = this.form.value.expMonth;
        payload.expYear = this.form.value.expYear;
      }

      this.facade.add(payload);
      this.close();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
