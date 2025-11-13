import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentFacade } from '../../../application/payment-facade.service';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css'
})
export class PaymentListComponent implements OnChanges {
  @Input() invoiceId!: number;

  facade = inject(PaymentFacade);

  displayedColumns = ['id', 'userId', 'amount', 'status', 'paidAt', 'actions'];

  ngOnChanges(): void {
    if (this.invoiceId) {
      this.facade.loadByInvoiceId(this.invoiceId);
    }
  }

  refund(paymentId: number): void {
    if (confirm('¿Está seguro de reembolsar este pago?')) {
      this.facade.refund(paymentId);
    }
  }

  getStatusColor(status: string): string {
    return status === 'PAID' ? 'primary' : status === 'REFUNDED' ? 'warn' : 'accent';
  }
}
