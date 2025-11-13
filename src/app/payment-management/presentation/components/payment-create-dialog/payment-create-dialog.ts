import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentFacade } from '../../../application/payment-facade.service';
import { PaymentMethodFacade } from '../../../application/payment-method-facade.service';
import { InvoiceFacade } from '../../../application/invoice-facade.service';

@Component({
  selector: 'app-payment-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './payment-create-dialog.html',
  styleUrl: './payment-create-dialog.css'
})
export class PaymentCreateDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PaymentCreateDialogComponent>);

  paymentFacade = inject(PaymentFacade);
  paymentMethodFacade = inject(PaymentMethodFacade);
  invoiceFacade = inject(InvoiceFacade);

  form = this.fb.group({
    paymentMethodId: [null as number | null, Validators.required]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { invoiceId: number; userId: number }) {}

  ngOnInit(): void {
    this.paymentMethodFacade.loadByUserId(this.data.userId);
    this.invoiceFacade.loadById(this.data.invoiceId);
  }

  submit(): void {
    const invoice = this.invoiceFacade.invoice();
    if (this.form.valid && invoice) {
      this.paymentFacade.create({
        invoiceId: invoice.id,
        bookingId: invoice.bookingId,
        userId: invoice.userId,
        paymentMethodId: this.form.value.paymentMethodId!,
        amount: invoice.total,
        currency: invoice.currency
      });
      this.close();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
