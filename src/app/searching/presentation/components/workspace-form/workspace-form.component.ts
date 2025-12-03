import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface WorkspaceCreateRequest {
  name: string;
  description: string;
  spaceType: string;
  capacity: number;
  price: number;
  address: string;
  available: boolean;
  images: string[];
  ownerId?: string; 
}

@Component({
  selector: 'app-workspace-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './workspace-form.component.html',
  styleUrl: './workspace-form.component.css'
})
export class WorkspaceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  workspaceForm!: FormGroup;
  isSubmitting = signal(false);
  
  spaceTypes = [
    'Oficina Privada',
    'Sala de Reuniones',
    'Escritorio Dedicado',
    'Espacio Coworking',
    'Sala de Conferencias'
  ];

  imageUrls = signal<string[]>([]);
  currentImageUrl = signal('');

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.workspaceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      spaceType: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true]
    });
  }

  get name() { return this.workspaceForm.get('name'); }
  get spaceType() { return this.workspaceForm.get('spaceType'); }
  get capacity() { return this.workspaceForm.get('capacity'); }
  get description() { return this.workspaceForm.get('description'); }
  get address() { return this.workspaceForm.get('address'); }
  get price() { return this.workspaceForm.get('price'); }
  get available() { return this.workspaceForm.get('available'); }

  addImageUrl(): void {
    const url = this.currentImageUrl().trim();
    if (url && this.isValidUrl(url)) {
      if (this.imageUrls().length < 5) {
        this.imageUrls.update(urls => [...urls, url]);
        this.currentImageUrl.set('');
      } else {
        this.showMessage('Máximo 5 imágenes permitidas', 'error');
      }
    } else {
      this.showMessage('URL de imagen no válida', 'error');
    }
  }

  removeImageUrl(index: number): void {
    this.imageUrls.update(urls => urls.filter((_, i) => i !== index));
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return !!(this.name?.valid && this.spaceType?.valid && this.capacity?.valid);
      case 1:
        return !!(this.description?.valid && this.address?.valid);
      case 2:
        return !!(this.price?.valid);
      default:
        return false;
    }
  }

  onSubmit(): void {
    if (this.workspaceForm.invalid) {
      this.workspaceForm.markAllAsTouched();
      this.showMessage('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (this.imageUrls().length === 0) {
      this.showMessage('Agrega al menos una imagen del espacio', 'error');
      return;
    }

    this.isSubmitting.set(true);

    const workspaceData: WorkspaceCreateRequest = {
      ...this.workspaceForm.value,
      images: this.imageUrls(),

    };

    // Simulación de llamada al servicio
    console.log('Workspace a crear:', workspaceData);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.showMessage('Espacio de trabajo creado exitosamente', 'success');
      this.router.navigate(['/searching/workspaces']);
    }, 1500);

  }

  cancel(): void {
    if (confirm('¿Estás seguro de cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/searching/workspaces']);
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snack-success' : 'snack-error'
    });
  }
}