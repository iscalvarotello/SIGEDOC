import { ApplicationConfig, LOCALE_ID   } from '@angular/core'   ;
import { provideZoneChangeDetection } from '@angular/core'   ;
import { provideRouter              } from '@angular/router' ;
import { withComponentInputBinding  } from '@angular/router' ;
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@core/interceptors/auth.interceptor';

import { routes } from './app.routes';

import { TitleStrategy } from '@angular/router';
import { AppTitleStrategy } from '@core/strategies/app-title.strategy';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';

registerLocaleData(localeEsMx, 'es-MX');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection ( { eventCoalescing: true } ) , 
    provideRouter ( routes, withComponentInputBinding() ),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ]
};
