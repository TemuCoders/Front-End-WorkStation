import { Component, inject } from '@angular/core';
import {FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchingStore } from '../../../application/searching-store';
import { Workspace } from '../../../domain/model/workspace.entity';
import { Address } from '../../../domain/model/address.entity';
import { User } from '../../../domain/model/user.entity';
import { Service } from '../../../domain/model/service.entity';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput, MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-workspace-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInput,
    MatInputModule,
    MatCheckboxModule,
    TranslatePipe,
    MatCardModule,
    MatProgressSpinnerModule,
    NgFor,
    NgIf
  ],
  templateUrl: './workspace-form.html',
  styleUrl: './workspace-form.css'
})
export class WorkspaceForm {
  private fb = inject(FormBuilder);
  public route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(SearchingStore);

  isEdit = false;
  workspaceId: number | null = null;

  form = this.fb.group({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    type: new FormControl<string>('private-office', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    capacity: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    pricePerDay: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)]
    }),
    isAvailable: new FormControl<boolean>(true, { nonNullable: true }),
    averageRating: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.min(0), Validators.max(5)]
    }),
    address: this.fb.group({
      street: [''],
      number: [''],
      district: [''],
      city: ['']
    }),
    owner: this.fb.group({
      firstName: [''],
      lastName: ['']
    }),
    services: this.fb.array([])
  });

  get services(): FormArray {
    return this.form.get('services') as FormArray;
  }

  constructor() {
    this.route.params.subscribe(params => {
      this.workspaceId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.workspaceId;

      if (this.isEdit) {
        const workspace = this.store.workspaces().find(w => w.id === this.workspaceId);
        if (workspace) {
          this.form.patchValue({
            name: workspace.name,
            description: workspace.description,
            type: workspace.type,
            capacity: workspace.capacity,
            pricePerDay: workspace.pricePerDay,
            isAvailable: workspace.isAvailable,
            averageRating: workspace.averageRating,
            address: {
              street: workspace.address?.street ?? '',
              number: workspace.address?.number?.toString() ?? '',
              district: workspace.address?.district ?? '',
              city: workspace.address?.city ?? ''
            },
            owner: {
              firstName: workspace.owner?.firstName ?? '',
              lastName: workspace.owner?.lastName ?? ''
            }
          });

          this.services.clear();
          workspace.services?.forEach(s =>
            this.services.push(
              this.fb.group({
                name: new FormControl<string>(s.name, { nonNullable: true })
              })
            )
          );
        }
      }
    });
  }

  addService() {
    this.services.push(
      this.fb.group({
        name: new FormControl<string>('', { nonNullable: true })
      })
    );
  }

  removeService(index: number) {
    this.services.removeAt(index);
  }

  submit() {
    if (this.form.invalid) return;

    const value = this.form.value;

    const address = new Address({
      street: value.address?.street ?? '',
      number: Number(value.address?.number ?? 0),
      district: value.address?.district ?? '',
      city: value.address?.city ?? ''
    });

    const owner = new User({
      firstName: value.owner?.firstName ?? '',
      lastName: value.owner?.lastName ?? ''
    });

    const services = ((value.services ?? []) as { name: string }[]).map(
      (s) =>
        new Service({
          id: 0,
          name: s.name,
          icon: '',
          description: ''
        })
    );


    const workspace = new Workspace({
      id: this.workspaceId ?? 0,
      name: value.name!,
      description: value.description!,
      type: value.type!,
      capacity: value.capacity!,
      pricePerDay: value.pricePerDay!,
      isAvailable: value.isAvailable!,
      averageRating: value.averageRating!,
      address,
      owner,
      services
    });


    if (this.isEdit) {
      this.store.updateWorkspace(workspace);
    } else {
      this.store.addWorkspace(workspace);
    }

    this.router.navigate(['searching/workspaces']).then();
  }
}
