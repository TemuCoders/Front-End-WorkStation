import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchingStore } from '../../../application/searching-store';
import { WorkspaceMinimalResource } from '../../../infrastructure/workspace-minimal.resource';

@Component({
  selector: 'app-workspace-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './space-detail.html',
  styleUrl: './space-detail.css'
})
export class WorkspaceDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(SearchingStore);

  workspaceId = signal<number | null>(null);
  currentImageIndex = signal(0);

  workspace = computed(() => {
    const id = this.workspaceId();
    if (!id) return null;
    return this.store.workspaces().find(w => w.spaceId === id);
  });

  images = computed(() => {
    const ws = this.workspace();
    if (!ws) return [];
    

    return ws.images && ws.images.length > 0 
      ? ws.images 
      : ['assets/placeholder.jpg'];
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      if (!isNaN(id)) {
        this.workspaceId.set(id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/searching/workspaces']);
  }

  previousImage() {
    const current = this.currentImageIndex();
    const total = this.images().length;
    this.currentImageIndex.set(current === 0 ? total - 1 : current - 1);
  }

  nextImage() {
    const current = this.currentImageIndex();
    const total = this.images().length;
    this.currentImageIndex.set(current === total - 1 ? 0 : current + 1);
  }

  selectImage(index: number) {
    this.currentImageIndex.set(index);
  }

  reserveWorkspace() {
    const ws = this.workspace();
    if (!ws) return;

    this.router.navigate(['/bookings/create', ws.spaceId]);
  }

}