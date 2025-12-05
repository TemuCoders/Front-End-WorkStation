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
    
    const isFreelancer = currentUser?.isFreelancer() || false;
    const isOwner = currentUser?.isOwner() || false;
    
    const items: SidebarItem[] = [];

    console.log('🔍 Sidebar - Usuario:', currentUser?.name);
    console.log('👤 Sidebar - Rol:', currentUser?.role?.roleName);
    console.log('✅ Sidebar - isFreelancer:', isFreelancer);
    console.log('✅ Sidebar - isOwner:', isOwner);

    items.push({
      route: `/profile/${userId}`,
      icon: 'house',
      label: 'Home',
      exact: true
    });

    items.push({
        route: '/bookings/list',
        icon: 'event',
        label: 'My Bookings',
        exact: false
    });

    if (isOwner) {
      console.log('🏢 Agregando "My Spaces" al sidebar');
      items.push({
        route: '/my-spaces',
        icon: 'business',
        label: 'My Spaces',
        exact: false
      });
    }


    items.push({
      route: '/payments',
      icon: 'payments',
      label: 'Payments',
      exact: false
    });


    items.push({
      route: ['/profile', userId, 'edit'],
      icon: 'person',
      label: 'Profile',
      exact: false
    });

    console.log('📋 Items finales del sidebar:', items.map(i => i.label));
    return items;
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

  readonly userRole = computed(() => {
    const currentUser = this.user();
    if (currentUser?.isFreelancer()) return 'Freelancer';
    if (currentUser?.isOwner()) return 'Owner';
    return 'User';
  });

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}