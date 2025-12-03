import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsApi } from '../../../infrastructure/bookings-api';
import { SearchingApi } from '../../../../searching/infrastructure/searching-api';
import { DatePipe, NgIf } from '@angular/common';
import { WorkspaceResource } from '../../../../searching/infrastructure/workspace-resource';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  templateUrl: './booking-detail.html',
  styleUrls: ['./booking-detail.css'],
  imports: [
    DatePipe,
    NgIf  
  ],
})
export class BookingDetailPage implements OnInit {  

  private route = inject(ActivatedRoute);
  private api = inject(BookingsApi);
  private searchingApi = inject(SearchingApi);
  private router = inject(Router);

  bookingId = Number(this.route.snapshot.paramMap.get('bookingId'));

  booking: any;
  workspace: WorkspaceResource | null = null;

  ngOnInit() {
    this.api.getBooking(this.bookingId).subscribe(b => {
      this.booking = b;
      this.searchingApi.getWorkspaceById(b.spaceId).subscribe(ws => {
        this.workspace = ws;
      });
    });
  }

  goToPayment() {
    this.router.navigate(['/payments', this.bookingId]);
  }
}