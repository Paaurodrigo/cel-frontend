// src/app/service/translation.service.ts

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  constructor(private translate: TranslateService) {
    // Añadimos los idiomas disponibles
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');

    // Detectamos el idioma del navegador, si está disponible
    const browserLang = this.translate.getBrowserLang() ?? 'es'; // ✅ por si es undefined
    const selectedLang = /en|es/.test(browserLang) ? browserLang : 'es';

    this.translate.use(selectedLang);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }
}
