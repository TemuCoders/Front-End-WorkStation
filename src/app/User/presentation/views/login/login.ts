import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../../application/User-store';
import { User } from '../../../domain/model/user.entity';
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
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);
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

    const users: User[] = this.userStore.users();

    if (!users || users.length === 0) {
      this.errorMessage = 'Cargando usuarios, intenta nuevamente en unos segundos';
      this.isLoading = false;
      return;
    }

    const found = users.find(u => u.email.toLowerCase() === this.email.toLowerCase());

    if (!found) {
      this.errorMessage = 'Email no encontrado';
      this.isLoading = false;
      return;
    }

    this.authService.login(found).subscribe({
      next: (authState) => {
        this.successMessage = '¡Inicio de sesión exitoso!';
        this.isLoading = false;

        console.log('✅ Login completo');
        console.log('Usuario:', authState.user);
        console.log('Rol:', authState.user?.role.roleName);
        console.log('Freelancer Profile:', authState.freelancerProfile);
        console.log('Owner Profile:', authState.ownerProfile);

        setTimeout(() => {
          this.router.navigate(['/profile', found.id]);
        }, 500);
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.errorMessage = 'Error al cargar el perfil. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }
}