import {Component, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../../application/User-store';
import { User } from '../../../domain/model/user.entity';

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

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.userData.personalInfo.nombre) {
      this.errorMessage = 'El nombre es obligatorio';
      return;
    }

    if (!this.userData.personalInfo.tipoUsuario) {
      this.errorMessage = 'Debes seleccionar un tipo de usuario';
      return;
    }

    if (this.birthError) {
      this.errorMessage = this.birthError;
      return;
    }

    const users = this.userStore.users();
    const emailExists = users.some(u => u.email === this.userData.email);
    if (emailExists) {
      this.errorMessage =
        'Este email ya está registrado. Usa otro email o inicia sesión.';
      return;
    }

    const now = new Date().toISOString();
    const nextSeed = users.length + 1;

    const age = this.userData.personalInfo.fechaNacimiento
      ? this.calculateAge(this.userData.personalInfo.fechaNacimiento)
      : 0;

    if (age < 0) {
      this.errorMessage = 'La fecha de nacimiento no puede ser futura.';
      return;
    }

    const newUser: User = {
      id: 0,
      created_at: now,
      updated_at: now,
      register_date: now,
      age,
      email: this.userData.email,
      location: this.userData.personalInfo.ubicacion || '',
      name: this.userData.personalInfo.nombre,
      password: this.userData.password,
      photo: `https://picsum.photos/seed/u${nextSeed}/300/300`,
    } as unknown as User;

    this.userStore.addUser(newUser);
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
    }
  }

  private calculateAge(dateString: string): number {
    if (!dateString) return 0;
    let birth = new Date(dateString);

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
