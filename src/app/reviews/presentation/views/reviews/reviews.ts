import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewSummaryComponent } from '../../components/review-summary/review-summary';
import { ReviewCreateFormComponent } from '../../components/review-create-form/review-create-form';
import { ReviewListComponent } from '../../components/review-list/review-list';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReviewSummaryComponent,
    ReviewCreateFormComponent,
    ReviewListComponent
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class ReviewsComponent implements OnInit {
  private route = inject(ActivatedRoute);

  spaceId = 1; // DEV: hardcoded
  userId = 1; // DEV: usuario logueado simulado

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('spaceId');
    if (idParam) {
      this.spaceId = +idParam;
    }
  }

  onReviewCreated(): void {
    // Opcional: refrescar si es necesario
  }
}
