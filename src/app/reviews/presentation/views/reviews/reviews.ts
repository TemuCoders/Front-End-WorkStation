import { Component, OnInit, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ReviewSummaryComponent } from '../../components/review-summary/review-summary';
import { ReviewCreateFormComponent } from '../../components/review-create-form/review-create-form';
import { ReviewListComponent } from '../../components/review-list/review-list';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { AuthService } from '../../../../User/infrastructure/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReviewSummaryComponent,
    ReviewCreateFormComponent,
    ReviewListComponent,
    Sidebar
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class ReviewsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  // espacio (puede venir por ruta)
  spaceId = 1;

  // datos del usuario actual
  userId: number | null = null;

  // reutilizamos el signal del AuthService
  readonly currentUser = computed(() => this.authService.currentUser());

  constructor() {
    effect(() => {
      const user = this.currentUser();
      this.userId = user?.id ?? null;

      console.log('🔍 Reviews - Usuario actual:', user?.name, 'ID:', this.userId);
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('spaceId');
    if (idParam) {
      this.spaceId = +idParam;
    }
  }

  onReviewCreated(): void {
    // Si quisieras, aquí podrías forzar recarga del listado:
    // this.facade.loadBySpaceId(this.spaceId, 0, this.facade.pageSize());
  }
}
