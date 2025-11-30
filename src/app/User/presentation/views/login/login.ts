import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../../application/User-store';
import { User } from '../../../domain/model/user.entity';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const users: User[] = this.userStore.users();

    if (!users || users.length === 0) {
      this.errorMessage = 'Cargando usuarios, intenta nuevamente en unos segundos';
      return;
    }

    const found = users.find(
      u => u.email === this.email && u.password === this.password
    );

    if (!found) {
      this.errorMessage = 'Email o contraseña incorrectos';
      return;
    }

    this.successMessage = '¡Inicio de sesión exitoso!';

    setTimeout(() => {
      this.router.navigate(['/profile', found.id]);
    }, 500);
  }
}