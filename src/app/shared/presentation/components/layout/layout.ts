import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { FooterContent } from '../footer-content/footer-content';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../User/infrastructure/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet, 
    RouterLink, 
    MatToolbarRow, 
    MatToolbar, 
    MatButton, 
    RouterLinkActive,
    TranslatePipe, 
    LanguageSwitcher, 
    FooterContent, 
    MatIconModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private authService = inject(AuthService);

  readonly options = computed(() => {
    const user = this.authService.currentUser();
    const profileId = user?.id || 1; 

    return [
      { link: '/searching/workspaces', label: 'option.workspaces' },
      { link: `/profile/${profileId}`, label: 'option.profile' },
    ];
  });
}