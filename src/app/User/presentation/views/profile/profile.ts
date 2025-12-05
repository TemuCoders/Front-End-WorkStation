import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UserStore } from '../../../application/User-store';
import { User } from '../../../domain/model/user.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchingStore } from '../../../../searching/application/searching-store';
import { WorkspaceMinimalResource } from '../../../../searching/infrastructure/workspace-minimal.resource';
import {BookingResponse} from '../../../../bookings/infrastructure/booking-response';
import {BookingApiEndpoint} from '../../../../bookings/infrastructure/booking-api-endpoint';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { AuthService } from '../../../infrastructure/auth.service';

type ReviewItem = {
  id: number;
  author: string;
  date: string;
  rating: number;
  text: string;
  likes: number;
  comments: number;
  avatar: string;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Sidebar
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userStore = inject(UserStore);
  private searchingStore = inject(SearchingStore);
  private bookingApi = inject(BookingApiEndpoint);
  private authService = inject(AuthService);

  private routeId = signal<number | null>(null);
  readonly editedUser = signal<User | undefined>(undefined);

  readonly searchLoading = this.searchingStore.loading;
  readonly searchError = this.searchingStore.error;
  private readonly allWorkspaces = this.searchingStore.workspaces;


  readonly isOwnProfile = computed(() => {
    const currentUser = this.authService.currentUser();
    const profileUser = this.editedUser();
    return currentUser?.id === profileUser?.id;
  });

  readonly myWorkspaces = computed<WorkspaceMinimalResource[] >(() => {
    const profileUser = this.editedUser();
    const list = this.allWorkspaces() || [];
    if (!profileUser) return [];

    if (profileUser.isOwner()) {
      const currentUser = this.authService.currentUser();

      if (currentUser?.id === profileUser.id) {
        const ownerId = this.authService.getOwnerId();
        if (ownerId) {
          const owned = list.filter(w => w.ownerId === ownerId);
          return owned.length ? owned : [];
        }
      }
    }

    return [];
  });


  readonly myBooking = computed<BookingResponse[]>(()=> {

    const profileUser = this.editedUser();
    const booking = signal<BookingResponse[]>([]).asReadonly();
    const list = booking() || [];
    if (!profileUser) return [];

    if (profileUser.isFreelancer()) {
      const currentUser = this.authService.currentUser();

      if (currentUser?.id === profileUser.id) {
        const freelancerId = this.authService.getFreelancerId();
        if (freelancerId) {
           const freelancer = list.filter(f => f.freelancerId === freelancerId);
          return freelancer.length ? freelancer : [];
        }
      }}

    return [];
  })

  readonly reviews = signal<ReviewItem[]>([
    {
      id: 1,
      author: 'Liam Carter',
      date: 'June 2023',
      rating: 5,
      text: "Sophia's studio was perfect for my needs. It was clean, well-equipped, and in a great location. I highly recommend it!",
      likes: 2,
      comments: 0,
      avatar: 'https://i.pravatar.cc/48?img=12'
    },
    {
      id: 2,
      author: 'Emily Stone',
      date: 'May 2023',
      rating: 4,
      text: 'Great workspace and host. Internet was very fast and the room was quiet.',
      likes: 4,
      comments: 1,
      avatar: 'https://i.pravatar.cc/48?img=32'
    }
  ]);

  readonly five = [1, 2, 3, 4, 5];

  constructor() {
    // ✅ VALIDACIÓN: Verificar que el usuario esté autenticado
    if (!this.authService.isAuthenticated()) {
      console.error('❌ Usuario no autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.pipe(takeUntilDestroyed()).subscribe(params => {
      const id = Number(params['id']);
      this.routeId.set(Number.isFinite(id) ? id : null);
    });

    effect(() => {
      const id = this.routeId();
      const users = this.userStore.users();
      const currentUser = this.authService.currentUser();

      if (!id) {
        this.editedUser.set(undefined);
        return;
      }

      if (currentUser && id !== currentUser.id) {
        console.warn('⚠️ Intentando ver otro perfil, redirigiendo al propio');
        this.router.navigate(['/profile', currentUser.id]);
        return;
      }

      const found = users.find(u => u.id === id);
      this.editedUser.set(found);
    });
  }

  firstName(full: string): string {
    return (full || '').split(' ')[0] || '';
  }

  avatarUrl(u: User): string {
    return u.photo || `https://i.pravatar.cc/120?u=${encodeURIComponent(u.email || String(u.id))}`;
  }

  joinedYear(u: User): number {
    const iso = u.registerDate;
    const d = iso ? new Date(iso) : new Date();
    return d.getFullYear();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
