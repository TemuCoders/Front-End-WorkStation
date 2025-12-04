import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { UserStore } from '../../../application/User-store';
import { User } from '../../../domain/model/user.entity';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../infrastructure/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    Sidebar
  ],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfile {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(UserStore);
  private authService = inject(AuthService);

  private routeId = signal<number | null>(null);
  readonly editedUser = signal<User | undefined>(undefined);

  readonly defaultAvatar = 'https://i.pravatar.cc/150';

  constructor() {
    this.route.params.pipe(takeUntilDestroyed()).subscribe(params => {
      const id = Number(params['id']);
      this.routeId.set(Number.isFinite(id) ? id : null);
    });

    effect(() => {
      const id = this.routeId();
      const users = this.store.users();
      if (!id) {
        this.editedUser.set(undefined);
        return;
      }
      const found = users.find(u => u.id === id);
      this.editedUser.set(found ? { ...found } : undefined);
    });
  }

  avatarUrl(user: User): string {
    return user.photo || this.defaultAvatar;
  }

  firstName(name?: string | null): string {
    if (!name) return 'User';
    return name.split(' ')[0];
  }

  onFieldChange<K extends keyof User>(field: K, value: any): void {
    const u = this.editedUser();
    if (!u) return;
    const v = field === 'age' ? Number(value) : value;
    this.editedUser.set({ ...u, [field]: v } as User);
  }

  save(): void {
    const u = this.editedUser();
    if (!u || !u.id) return;
    
    const updateRequest = {
      name: u.name,
      age: u.age,
      location: u.location,
      photo: u.photo
    };
    
    this.store.updateUser(u.id, updateRequest);

    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id === u.id) {
      this.authService.updateUser(u.id, updateRequest);
    }

    this.goBack();
  }

  delete(): void {
    const u = this.editedUser();
    if (!u || !u.id) return;
    
    this.store.deleteUser(u.id);

    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id === u.id) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}