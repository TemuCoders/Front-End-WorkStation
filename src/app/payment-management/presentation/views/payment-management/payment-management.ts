import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceDetailsComponent } from '../../components/invoice-details/invoice-details';
import { PaymentListComponent } from '../../components/payment-list/payment-list';
import { PaymentCreateDialogComponent } from '../../components/payment-create-dialog/payment-create-dialog';
import { PaymentMethodListComponent } from '../../components/payment-method-list/payment-method-list';
import { PaymentMethodAddDialogComponent } from '../../components/payment-method-add-dialog/payment-method-add-dialog';

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    TranslateModule,
    InvoiceDetailsComponent,
    PaymentListComponent,
    PaymentMethodListComponent
  ],
  templateUrl: './payment-management.html',
  styleUrl: './payment-management.css'
})
export class PaymentManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  invoiceId = 1; // DEV: hardcoded
  userId = 1; // DEV: usuario logueado simulado

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('invoiceId');
    if (idParam) {
      this.invoiceId = +idParam;
    }
  }

  openCreatePayment(): void {
    this.dialog.open(PaymentCreateDialogComponent, {
      data: { invoiceId: this.invoiceId, userId: this.userId },
      width: '500px'
    });
  }

  openAddPaymentMethod(): void {
    this.dialog.open(PaymentMethodAddDialogComponent, {
      data: { userId: this.userId },
      width: '500px'
    });
  }
}
