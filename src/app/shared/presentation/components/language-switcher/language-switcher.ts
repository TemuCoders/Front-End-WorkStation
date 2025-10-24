import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-language-switcher',
  imports: [MatButtonToggleModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  currentLanguage: string = 'en';
  availableLanguages: string[] = ['en', 'es'];
  constructor(private translateService: TranslateService){
    this.currentLanguage = translateService.getCurrentLang();
  }
  changeLanguage(newLanguage: string) {
    this.translateService.use(newLanguage);
  }

}
