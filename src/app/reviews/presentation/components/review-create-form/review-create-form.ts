import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewFacade } from '../../../application/review-facade.service';

@Component({
  selector: 'app-review-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './review-create-form.html',
  styleUrl: './review-create-form.css'
})
export class ReviewCreateFormComponent {
  @Input({ required: true }) spaceId!: number;
  @Input({ required: true }) userId!: number;
  @Output() created = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private facade = inject(ReviewFacade);

  form = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]]
  });

  submit(): void {
    if (this.form.valid) {
      this.facade.create({
        spaceId: this.spaceId,
        userId: this.userId,
        rating: this.form.value.rating!,
        comment: this.form.value.comment!.trim()
      });

      this.form.reset({ rating: 5, comment: '' });
      this.created.emit();
    }
  }
}
