import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../domain/model/user.entity';
import { UserApi } from './user-api.service';
import { RegisterUserRequest } from './register-user.request';
import { UpdateUserProfileRequest } from './update-user-profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor(private userApi: UserApi) {
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

  register(request: RegisterUserRequest): Observable<User> {
    return this.userApi.createUser(request).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }


  updateUser(id: number, request: UpdateUserProfileRequest): Observable<User> {
    return this.userApi.updateUser(id, request).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  getUserId(): number | null {
    const user = this.currentUserSignal();
    return user ? user.id : null;
  }

  getUser(): User | null {
    return this.currentUserSignal();
  }

  getUserName(): string | null {
    const user = this.currentUserSignal();
    return user ? user.name : null;
  }
}