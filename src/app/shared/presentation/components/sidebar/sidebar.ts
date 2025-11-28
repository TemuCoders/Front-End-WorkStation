import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../User/domain/model/user.entity'; 

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
  @Input({ required: true }) user!: User;

  readonly navItems = computed<SidebarItem[]>(() => [
    { 
      route: `/profile/${this.user?.id || 1}`, 
      icon: 'house', 
      label: 'Home',
      exact: true 
    },
    { route: '/bookings', icon: 'event', label: 'Bookings', exact: false },
    { route: '/payments', icon: 'payments', label: 'Payments', exact: false },
    { route: '/reviews', icon: 'reviews', label: 'Reviews', exact: false },
    { 
      route: ['/profile', this.user?.id || 1, 'edit'], 
      icon: 'person', 
      label: 'Profile',
      exact: false 
    },
  ]);

  readonly firstName = computed(() => {
    const name = this.user?.name || '';
    return name.split(' ')[0] || '';
  });

  readonly avatarUrl = computed(() => {
    const u = this.user;
    if (!u) return 'https://i.pravatar.cc/120';
    return u.photo || `https://i.pravatar.cc/120?u=${encodeURIComponent(u.email || String(u.id))}`;
  });
}