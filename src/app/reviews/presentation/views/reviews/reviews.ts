import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewSummaryComponent } from '../../components/review-summary/review-summary';
import { ReviewCreateFormComponent } from '../../components/review-create-form/review-create-form';
import { ReviewListComponent } from '../../components/review-list/review-list';
import { Sidebar } from '../../../../shared/presentation/components/sidebar/sidebar';
import { UserStore } from '../../../../User/application/User-store'; 
import { User } from '../../../../User/domain/model/user.entity'; 

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
  private userStore = inject(UserStore);

  spaceId = 1; // DEV: hardcoded
  userId = 1; 

  // Signal para el usuario actual
  readonly currentUser = signal<User | undefined>(undefined);

  constructor() {
    // ← ESTO FALTABA: Efecto para cargar el usuario
    effect(() => {
      const users = this.userStore.users();
      const found = users.find(u => u.id === this.userId);
      this.currentUser.set(found);
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('spaceId');
    if (idParam) {
      this.spaceId = +idParam;
    }
  }

  onReviewCreated(): void {
    
  }
}