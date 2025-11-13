import { Component, Input, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewFacade } from '../../../application/review-facade.service';

@Component({
  selector: 'app-review-summary',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule, TranslateModule],
  templateUrl: './review-summary.html',
  styleUrl: './review-summary.css'
})
export class ReviewSummaryComponent implements OnChanges {
  @Input() spaceId!: number;

  facade = inject(ReviewFacade);

  ngOnChanges(): void {
    if (this.spaceId) {
      this.facade.loadBySpaceId(this.spaceId);
    }
  }
}
