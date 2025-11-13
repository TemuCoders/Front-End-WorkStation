import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { InvoiceFacade } from '../../../application/invoice-facade.service';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.css'
})
export class InvoiceDetailsComponent implements OnChanges {
  @Input() invoiceId!: number;

  facade = inject(InvoiceFacade);

  ngOnChanges(): void {
    if (this.invoiceId) {
      this.facade.loadById(this.invoiceId);
    }
  }

  sendInvoice(): void {
    if (this.facade.invoice()) {
      this.facade.send(this.facade.invoice()!.id);
    }
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'DRAFT': 'accent',
      'ISSUED': 'primary',
      'SENT': 'primary',
      'PAID': 'primary',
      'CANCELLED': 'warn'
    };
    return colors[status] || 'primary';
  }
}
