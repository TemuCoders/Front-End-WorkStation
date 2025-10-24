import { Component } from '@angular/core'
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {FooterContent} from '../footer-content/footer-content';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, MatToolbarRow, MatToolbar, MatButton, RouterLinkActive,
    TranslatePipe, LanguageSwitcher, FooterContent, MatIconModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  options = [
    {link: '/home', label: 'option.home'},
    {link: '/about', label: 'option.about'},
    {link: '/searching/workspaces', label: 'option.workspaces'},
  ];
}
