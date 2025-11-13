import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewFacade } from '../../../application/review-facade.service';
import { Review } from '../../../domain/model/review.entity';

@Component({
  selector: 'app-review-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    TranslateModule
  ],
  templateUrl: './review-edit-dialog.html',
  styleUrl: './review-edit-dialog.css'
})
export class ReviewEditDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ReviewEditDialogComponent>);
  private facade = inject(ReviewFacade);

  form = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(2000)]]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { review: Review }) {}

  ngOnInit(): void {
    // Pre-cargar valores existentes
    this.form.patchValue({
      rating: this.data.review.rating,
      comment: this.data.review.comment
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.facade.update(this.data.review.id, {
        rating: this.form.value.rating!,
        comment: this.form.value.comment!.trim()
      });
      this.close();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
