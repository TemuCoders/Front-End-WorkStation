import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewFacade } from '../../../application/review-facade.service';
import { Review } from '../../../domain/model/review.entity';
import { ReviewEditDialogComponent } from '../review-edit-dialog/review-edit-dialog';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css']
})
export class ReviewListComponent implements OnChanges {
  @Input({ required: true }) spaceId!: number;
  @Input() currentUserId: number | null = null;
  @Input() currentUserName = '';   // 👈 NUEVO

  facade = inject(ReviewFacade);
  dialog = inject(MatDialog);

  ngOnChanges(): void {
    if (this.spaceId) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    this.facade.loadBySpaceId(
      this.spaceId,
      this.facade.currentPage(),
      this.facade.pageSize()
    );
  }

  editReview(review: Review): void {
    this.dialog.open(ReviewEditDialogComponent, {
      data: { review },
      width: '520px'
    });
  }

  deleteReview(reviewId: number): void {
    if (confirm('¿Eliminar esta reseña?')) {
      this.facade.delete(reviewId);
    }
  }

  onPageChange(event: PageEvent): void {
    this.facade.loadBySpaceId(this.spaceId, event.pageIndex, event.pageSize);
  }

  getStars(rating: number): number[] {
    return Array.from({ length: rating });
  }
}
