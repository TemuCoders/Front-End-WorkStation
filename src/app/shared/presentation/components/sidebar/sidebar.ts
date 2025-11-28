import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../User/domain/model/user.entity'; 

interface SidebarItem {
  route: string;
  icon: string;
  label: string;
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
  @Input() userId?: number;

  readonly navItems: SidebarItem[] = [
    { route: '/profile', icon: 'person', label: 'Perfil' },
    { route: '/bookings', icon: 'event', label: 'Bookings' },
    { route: '/payments', icon: 'payments', label: 'Payments' },
    { route: '/reviews', icon: 'reviews', label: 'Reviews' }
  ];

  // Computed para el nombre
  readonly firstName = computed(() => {
    const name = this.user?.name || '';
    return name.split(' ')[0] || '';
  });

  // Computed para el avatar
  readonly avatarUrl = computed(() => {
    const u = this.user;
    if (!u) return 'https://i.pravatar.cc/120';
    return u.photo || `https://i.pravatar.cc/120?u=${encodeURIComponent(u.email || String(u.id))}`;
  });

  // Método para obtener la ruta completa del perfil
  getProfileRoute(): string {
    return this.userId ? `/profile/${this.userId}` : '/profile/1';
  }
}



