import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PaymentsApi {
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/payments';

  createPayment(payload: any) {
    return this.http.post<any>(this.base, payload);
  }

  getPayments() {
    return this.http.get<any[]>(this.base);
  }
}
