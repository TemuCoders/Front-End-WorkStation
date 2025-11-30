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
  financialInfo: {
    ingresoMensual: number;
    ocupacion: string;
    banco: string;
    tipoCuenta: string;
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
  currentStep = 1;
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
    financialInfo: {
      ingresoMensual: 0,
      ocupacion: '',
      banco: '',
      tipoCuenta: '',
    },
  };

  confirmPassword = '';
  birthError = '';

  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);


  nextStep(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.currentStep !== 1) return;

    if (!this.userData.email) {
      this.errorMessage = 'El email es obligatorio';
      return;
    }

    if (!this.userData.password) {
      this.errorMessage = 'La contraseña es obligatoria';
      return;
    }

    if (!this.confirmPassword) {
      this.errorMessage = 'Debes confirmar la contraseña';
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.userData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
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

    this.currentStep = 2;
    window.scrollTo(0, 0);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.birthError) {
      this.errorMessage = this.birthError;
      this.currentStep = 1;
      return;
    }

    // resto igual, pero usa ubicacion y edad calculada:
    const now = new Date().toISOString();
    const users = this.userStore.users();
    const nextSeed = users.length + 1;

    const age = this.userData.personalInfo.fechaNacimiento
      ? this.calculateAge(this.userData.personalInfo.fechaNacimiento)
      : 0;
    if (age < 0) {
      this.errorMessage = 'La fecha de nacimiento no puede ser futura.';
      this.currentStep = 1;
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
    let birth: Date;

    if (dateString.includes('-')) {
      birth = new Date(dateString);
    } else if (dateString.includes('/')) {
      const [dd, mm, yyyy] = dateString.split('/');
      birth = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    } else {
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Number.isNaN(age) ? 0 : age;
  }
  previousStep(): void {
    this.currentStep = 1;
    this.errorMessage = '';
    this.successMessage = '';
    window.scrollTo(0, 0);
  }
}