// src/app/components/language-switcher/language-switcher.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../service/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button class="btn btn-outline-light" (click)="switchLanguage('es')">
        🇪🇸
      </button>
      <button class="btn btn-outline-light" (click)="switchLanguage('en')">
        🇬🇧
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 0.5rem;
    }
    .btn {
      padding: 0.3rem 0.6rem;
      font-size: 1.2rem;
    }
  `]
})
export class LanguageSwitcherComponent {
  constructor(private translationService: TranslationService) {}

  switchLanguage(lang: string): void {
    this.translationService.changeLanguage(lang);
  }
}
