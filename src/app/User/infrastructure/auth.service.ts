import { Injectable, signal, computed } from '@angular/core';
import { User } from '../domain/model/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  
  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  register(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }

  updateUser(user: User): void {
    this.currentUserSignal.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}