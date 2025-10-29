import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer-content',
  imports: [TranslatePipe, MatIconModule],
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.css'
})
export class FooterContent {

}
