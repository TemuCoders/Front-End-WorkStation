import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentMethodFacade } from '../../../application/payment-method-facade.service';

@Component({
  selector: 'app-payment-method-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './payment-method-list.html',
  styleUrl: './payment-method-list.css'
})
export class PaymentMethodListComponent implements OnChanges {
  @Input() userId!: number;

  facade = inject(PaymentMethodFacade);

  ngOnChanges(): void {
    if (this.userId) {
      this.facade.loadByUserId(this.userId);
    }
  }

  disable(id: number): void {
    if (confirm('¿Deshabilitar este método de pago?')) {
      this.facade.disable(id);
    }
  }
}
