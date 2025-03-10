import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JWTInterceptor } from './interceptor/jwt.interceptor';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad'; // 📌 Importar el módulo de firma

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(), 
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },

    // ✅ Añadir módulo de firma digital
    importProvidersFrom(AngularSignaturePadModule)
   
  ],
};
