import { Injectable, DestroyRef, inject } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { UserApi } from '../infrastructure/user-api.service';
import { User } from '../domain/model/user.entity';
import { RegisterUserRequest } from '../infrastructure/register-user.request';
import { UpdateUserProfileRequest } from '../infrastructure/update-user-profile';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private readonly usersSignal = signal<User[]>([]);
  readonly users = this.usersSignal.asReadonly();
  readonly userCount = computed(() => this.usersSignal().length);

  private destroyRef = inject(DestroyRef);

  constructor(private api: UserApi) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.api.getUsers()
      .pipe(
        retry(2),
        takeUntilDestroyed(this.destroyRef)  
      )
      .subscribe({
        next: (list: User[]) => {
          this.usersSignal.set(list);
        },
        error: (err: any) => {
          console.error('Error loading users', err);
        }
      });
  }

  getUserById(id: number): Signal<User | undefined> {
    return computed(() => this.users().find(user => user.id === id));
  }

  addUser(request: RegisterUserRequest): void {
    this.api.createUser(request)
      .pipe(
        takeUntilDestroyed(this.destroyRef)  
      )
      .subscribe({
        next: (newUser: User) => {
          this.usersSignal.update(users => [...users, newUser]);
        },
        error: (err: any) => {
          console.error('Error creating user', err);
        }
      });
  }

  updateUser(id: number, request: UpdateUserProfileRequest): void {
    this.api.updateUser(id, request)
      .pipe(
        takeUntilDestroyed(this.destroyRef)  
      )
      .subscribe({
        next: (updatedUser: User) => {
          this.usersSignal.update(users =>
            users.map(u => u.id === updatedUser.id ? updatedUser : u)
          );
        },
        error: (err: any) => {
          console.error('Error updating user', err);
        }
      });
  }

  deleteUser(id: number): void {
    this.api.deleteUser(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef) 
      )
      .subscribe({
        next: () => {
          this.usersSignal.update(users => users.filter(u => u.id !== id));
        },
        error: (err: any) => {
          console.error('Error deleting user', err);
        }
      });
  }
}