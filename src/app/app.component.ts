import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CountryService } from '@location/countries/country.service';
import { DOCUMENT } from '@angular/common';
import { APP_SETTINGS } from '@metasystem/settings/app.settings';

import { ThemeService } from '@metasystem/themes/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = APP_SETTINGS.PAGE_TITLE_FORMAT;

  private countryService = inject(CountryService);
  private document = inject(DOCUMENT);
  private themeService = inject(ThemeService);

  // Método 2: Obtenemos el Signal directamente desde el servicio
  countriesSignal = this.countryService.getSignalAll();

  constructor() {
    this.themeService.initTheme();
    this.setDynamicBrand();

    console.log('🚀 Iniciando petición vía Signals...');
    
    // effect() observa los Signals y se ejecuta automáticamente cada vez que su valor cambia
    effect(() => {
      const response = this.countriesSignal();
      
      if (response) {
        console.log('✅ Países obtenidos vía Signals:', response.data);
      }
    });
  }

  private setDynamicBrand() {
    // Establecer favicon dinámico
    const link: HTMLLinkElement = this.document.querySelector("link[rel*='icon']") || this.document.createElement('link');
    const isSvg = APP_SETTINGS.FAVICON_PATH.endsWith('.svg');
    link.type = isSvg ? 'image/svg+xml' : 'image/x-icon';
    link.rel = 'icon';
    link.href = APP_SETTINGS.FAVICON_PATH;
    this.document.getElementsByTagName('head')[0].appendChild(link);
    
    // El título de la aplicación será gestionado por el AppTitleStrategy
  }
}
