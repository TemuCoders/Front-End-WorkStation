import { Routes } from '@angular/router';
import { PaymentManagementComponent } from './payment-management/payment-management';

export const paymentRoutes: Routes = [
  {
    path: '',
    component: PaymentManagementComponent,
    title: 'WorkStation - Payment Management'
  },
  {
    path: ':invoiceId',
    component: PaymentManagementComponent,
    title: 'WorkStation - Invoice Details'
  }
];
