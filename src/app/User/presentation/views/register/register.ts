import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../../application/User-store';
import { RegisterUserRequest } from '../../../infrastructure/register-user.request';

interface RegisterForm {
  email: string;
  password: string;
  personalInfo: {
    nombre: string;
    ubicacion: string;
    tipoUsuario: 'Hoster' | 'Comprador' | '';
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
  private readonly userStore = inject(UserStore);

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.userData.email) {
      this.errorMessage = 'El email es obligatorio';
      return;
    }

    if (!this.userData.password) {
      this.errorMessage = 'La contraseña es obligatoria';
      return;
    }

    if (this.userData.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.userData.personalInfo.nombre) {
      this.errorMessage = 'El nombre es obligatorio';
      return;
    }

    if (!this.userData.personalInfo.ubicacion) {
      this.errorMessage = 'La ubicación es obligatoria';
      return;
    }

    if (!this.userData.personalInfo.tipoUsuario) {
      this.errorMessage = 'Debes seleccionar un tipo de usuario';
      return;
    }

    if (!this.userData.personalInfo.fechaNacimiento) {
      this.errorMessage = 'La fecha de nacimiento es obligatoria';
      return;
    }

    if (this.birthError) {
      this.errorMessage = this.birthError;
      return;
    }

    const users = this.userStore.users();
    const emailExists = users.some(u => u.email === this.userData.email);
    if (emailExists) {
      this.errorMessage = 'Este email ya está registrado. Usa otro email o inicia sesión.';
      return;
    }

    const age = this.calculateAge(this.userData.personalInfo.fechaNacimiento);

    if (age < 18) {
      this.errorMessage = 'Debes ser mayor de 18 años para registrarte.';
      return;
    }

    if (age < 0) {
      this.errorMessage = 'La fecha de nacimiento no puede ser futura.';
      return;
    }

    const nextSeed = users.length + 1;

    const registerRequest: RegisterUserRequest = {
      name: this.userData.personalInfo.nombre,
      email: this.userData.email,
      password: this.userData.password,
      photo: `https://picsum.photos/seed/u${nextSeed}/300/300`,
      age: age,
      location: this.userData.personalInfo.ubicacion
    };

    this.userStore.addUser(registerRequest);
    this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
    setTimeout(() => this.router.navigate(['/login']), 1500);
  }

  onBirthDateChange(value: string): void {
    this.userData.personalInfo.fechaNacimiento = value;
    this.birthError = '';
    if (!value) return;

    const age = this.calculateAge(value);
    if (age < 0) {
      this.birthError = 'La fecha de nacimiento no puede ser futura.';
    } else if (age < 18) {
      this.birthError = 'Debes ser mayor de 18 años para registrarte.';
    }
  }

  private calculateAge(dateString: string): number {
    if (!dateString) return 0;
    const birth = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}