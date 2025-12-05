import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../infrastructure/auth.service';

interface RegisterForm {
  email: string;
  password: string;
  personalInfo: {
    nombre: string;
    ubicacion: string;
    tipoUsuario: 'OWNER' | 'FREELANCER' | '';
    fechaNacimiento: string;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  userData: RegisterForm = {
    email: '',
    password: '',
    personalInfo: {
      nombre: '',
      ubicacion: '',
      tipoUsuario: '',
      fechaNacimiento: '',
    },
  };

  confirmPassword = '';
  birthError = '';

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.userData.email) return this.setError('El email es obligatorio');
    if (!this.userData.password) return this.setError('La contraseña es obligatoria');
    if (this.userData.password.length < 8) return this.setError('La contraseña debe tener al menos 8 caracteres');
    if (this.userData.password !== this.confirmPassword) return this.setError('Las contraseñas no coinciden');
    if (!this.userData.personalInfo.nombre) return this.setError('El nombre es obligatorio');
    if (!this.userData.personalInfo.ubicacion) return this.setError('La ubicación es obligatoria');
    if (!this.userData.personalInfo.tipoUsuario) return this.setError('Debes seleccionar un tipo de usuario');
    if (!this.userData.personalInfo.fechaNacimiento) return this.setError('La fecha de nacimiento es obligatoria');
    if (this.birthError) return this.setError(this.birthError);

    const age = this.calculateAge(this.userData.personalInfo.fechaNacimiento);
    if (age < 0) return this.setError('La fecha de nacimiento no puede ser futura.');
    if (age < 18) return this.setError('Debes ser mayor de 18 años para registrarte.');

    const registerRequest = {
      name: this.userData.personalInfo.nombre,
      email: this.userData.email,
      password: this.userData.password,
      photo: `https://picsum.photos/seed/${Date.now()}/300/300`,
      age,
      location: this.userData.personalInfo.ubicacion,
      roleName: this.userData.personalInfo.tipoUsuario
    };

    console.log('RegisterRequest:', registerRequest);

    // Registrar usando AuthService
    this.authService.register(registerRequest).subscribe({
      next: (user) => {
        this.successMessage = '¡Registro exitoso! Redirigiendo a tu perfil...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        if (err.error && err.error.message) {
          this.setError(`Error: ${err.error.message}`);
        } else {
          this.setError('Ocurrió un error al registrar. Intenta nuevamente.');
        }
        this.isLoading = false;
      }
    });
  }

  onBirthDateChange(value: string): void {
    this.userData.personalInfo.fechaNacimiento = value;
    this.birthError = '';
    if (!value) return;
    const age = this.calculateAge(value);
    if (age < 0) this.birthError = 'La fecha de nacimiento no puede ser futura.';
    else if (age < 18) this.birthError = 'Debes ser mayor de 18 años para registrarte.';
  }

  private calculateAge(dateString: string): number {
    const birth = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  private setError(msg: string) {
    this.errorMessage = msg;
    this.isLoading = false;
  }
}
