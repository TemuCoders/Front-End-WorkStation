import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../User/infrastructure/auth.service';

interface SidebarItem {
  route: string | any[]; 
  icon: string;
  label: string;
  exact: boolean; 
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  user = this.authService.currentUser;

  readonly navItems = computed<SidebarItem[]>(() => {
    const currentUser = this.user();
    const userId = currentUser?.id || 1;
    
    return [
      { 
        route: `/profile/${userId}`, 
        icon: 'house', 
        label: 'Home',
        exact: true 
      },
      { route: '/bookings', icon: 'event', label: 'Bookings', exact: false },
      { route: '/payments', icon: 'payments', label: 'Payments', exact: false },
      { route: '/reviews', icon: 'reviews', label: 'Reviews', exact: false },
      { 
        route: ['/profile', userId, 'edit'], 
        icon: 'person', 
        label: 'Profile',
        exact: false 
      },
    ];
  });

  readonly firstName = computed(() => {
    const currentUser = this.user();
    const name = currentUser?.name || '';
    return name.split(' ')[0] || 'Guest';
  });

  readonly avatarUrl = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return 'https://i.pravatar.cc/120';
    return currentUser.photo || 
           `https://i.pravatar.cc/120?u=${encodeURIComponent(currentUser.email || String(currentUser.id))}`;
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}