import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserStore } from '../../../application/User-store';
import { User } from '../../../domain/model/user.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfile {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(UserStore);

  private routeId = signal<number | null>(null);
  readonly editedUser = signal<User | undefined>(undefined);

  constructor() {
    this.route.params.pipe(takeUntilDestroyed()).subscribe(params => {
      const id = Number(params['id']);
      this.routeId.set(Number.isFinite(id) ? id : null);
    });

    effect(() => {
      const id = this.routeId();
      const users = this.store.users();
      if (!id) { this.editedUser.set(undefined); return; }
      const found = users.find(u => u.id === id);
      this.editedUser.set(found ? { ...found } : undefined);
    });
  }

  onFieldChange<K extends keyof User>(field: K, value: any): void {
    const u = this.editedUser(); if (!u) return;
    const v = field === 'age' ? Number(value) : value;
    this.editedUser.set({ ...u, [field]: v } as User);
  }

  save(): void {
    const u = this.editedUser(); if (!u) return;
    if (u.id && u.id > 0) this.store.updateUser(u);
    else this.store.addUser(u);
    this.goBack();
  }

  delete(): void {
    const u = this.editedUser(); if (!u || !u.id) return;
    this.store.deleteUser(u.id);
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
