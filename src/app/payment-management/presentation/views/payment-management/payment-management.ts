import { Component, OnInit, inject, signal, effect } from '@angular/core';
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
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { AuthService } from '../../../../User/infrastructure/auth.service';
import { User } from '../../../../User/domain/model/user.entity';

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
    PaymentMethodListComponent,
    PaymentMethodAddDialogComponent,
    Sidebar
  ],
  templateUrl: './payment-management.html',
  styleUrl: './payment-management.css'
})
export class PaymentManagementComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  invoiceId = 0;
  userId = 0;

  // Solo si aún necesitas el signal para algo más
  readonly currentUser = signal<User | null>(null);

  constructor() {
    // Vinculamos el usuario actual al AuthService
    effect(() => {
      const user = this.authService.currentUser();
      this.currentUser.set(user ?? null);

      if (user) {
        this.userId = user.id;
        console.log('💳 PaymentManagement - userId (from auth):', this.userId);
      } else {
        this.userId = 0;
        console.warn('⚠️ PaymentManagement - No hay usuario logueado');
      }
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('invoiceId');
    this.invoiceId = idParam ? +idParam : 0;
    console.log('📄 PaymentManagement - invoiceId:', this.invoiceId);
  }

  openCreatePayment(): void {
    if (!this.invoiceId || !this.userId) {
      console.warn('⚠️ No se puede crear pago, falta invoiceId o userId');
      return;
    }

    this.dialog.open(PaymentCreateDialogComponent, {
      data: { invoiceId: this.invoiceId, userId: this.userId },
      width: '500px'
    });
  }

  openAddPaymentMethod(): void {
    if (!this.userId) {
      console.warn('⚠️ No se puede agregar método de pago, no hay userId');
      return;
    }

    this.dialog.open(PaymentMethodAddDialogComponent, {
      data: { userId: this.userId },
      width: '500px'
    });
  }
}
