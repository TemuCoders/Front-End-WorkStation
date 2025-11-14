import { Injectable, DestroyRef, inject, computed, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import { UserApi } from '../infrastructure/user-api.service';
import { User } from '../domain/model/user.entity';

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly usersSignal = signal<User[]>([]);
  readonly users = this.usersSignal.asReadonly();
  readonly userCount = computed(() => this.usersSignal().length);


  private readonly destroyRef = inject(DestroyRef);

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
        next: (list: User[]) => this.usersSignal.set(list),
        error: (err: any) => console.error('Error loading users', err)
      });
  }

  getUserById(id: number): Signal<User | undefined> {
    return computed(() => this.users().find(user => user.id === id));
  }

  addUser(user: User): void {
    this.api.createUser(user)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (newUser: User) => this.usersSignal.update(users => [...users, newUser]),
        error: (err: any) => console.error('Error creating user', err)
      });
  }

  updateUser(user: User): void {
    this.api.updateUser(user)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (updated: User) =>
          this.usersSignal.update(users => users.map(u => u.id === updated.id ? updated : u)),
        error: (err: any) => console.error('Error updating user', err)
      });
  }

  deleteUser(id: number): void {
    this.api.deleteUser(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => this.usersSignal.update(users => users.filter(u => u.id !== id)),
        error: (err: any) => console.error('Error deleting user', err)
      });
  }
}
