import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsApi } from '../../infrastructure/bookings-api';
import { SearchingStore } from '../../../searching/application/searching-store';
import { AuthService } from '../../../User/infrastructure/auth.service';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings-list.html',
  styleUrls: ['./bookings-list.css']
})
export class BookingsListPage {

  private api = inject(BookingsApi);
  private searching = inject(SearchingStore);
  private auth = inject(AuthService);

  bookings: any[] = [];

  ngOnInit() {
    const user = this.auth.currentUser();
    if (!user) return;

    this.api.getBookings().subscribe({
      next: data => {
        this.bookings = data.filter(b => b.freelancerId === user.id);
      }
    });
  }

  /** Obtiene el nombre del workspace por ID */
  getWorkspaceName(id: number): string {
    const ws = this.searching.workspaces().find(w => w.id === id);
    return ws ? ws.name : 'Espacio desconocido';
  }
}
