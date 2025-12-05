import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../infrastructure/auth.service';

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
  isLoading = false;

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.email) {
      this.errorMessage = 'Por favor ingresa tu email';
      this.isLoading = false;
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Por favor ingresa tu contraseña';
      this.isLoading = false;
      return;
    }

    this.authService.loginWithCredentials(this.email, this.password).subscribe({
      next: (authState) => {
        this.successMessage = '¡Inicio de sesión exitoso!';
        this.isLoading = false;

        console.log('✅ Login completo');
        console.log('Usuario:', authState.user);
        console.log('Rol:', authState.user?.role?.roleName);
        console.log('Token:', authState.token ? 'Presente ✓' : 'Falta ✗');
        console.log('Freelancer Profile:', authState.freelancerProfile);
        console.log('Owner Profile:', authState.ownerProfile);

        setTimeout(() => {
          if (authState.user) {
            this.router.navigate(['/profile', authState.user.id]);
          }
        }, 500);
      },
      error: (err) => {
        console.error('❌ Error en login:', err);

        if (err.status === 401) {
          this.errorMessage = 'Email o contraseña incorrectos';
        } else if (err.status === 404) {
          this.errorMessage = 'Usuario no encontrado';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
        }

        this.isLoading = false;
      }
    });
  }
}
