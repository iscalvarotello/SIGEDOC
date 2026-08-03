import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_SETTINGS, THEMES } from '../settings/app.settings';
import { ThemeDefinition } from '../interfaces/app.theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Señal para reactividad en componentes si es necesario
  public activeThemeId = signal<string>('institucional');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  public initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 1. Intentar recuperar el tema del LocalStorage
      const savedThemeId = localStorage.getItem('system_active_theme');
      
      if (savedThemeId && THEMES[savedThemeId]) {
        this.activeThemeId.set(savedThemeId);
        this.applyThemeToDOM(THEMES[savedThemeId]);
      } else {
        // 2. Si no hay tema guardado, usar el por defecto de APP_SETTINGS
        const defaultTheme = APP_SETTINGS.THEME;
        this.applyThemeToDOM(defaultTheme);
        // También guardamos el id por defecto en la señal (usualmente 'institucional' o 'verano' pero no sabemos el key, así que lo omitimos o buscamos)
      }
    }
  }

  /**
   * Cambia el tema en caliente y guarda la preferencia.
   */
  public setTheme(themeId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const theme = THEMES[themeId];
      if (theme) {
        localStorage.setItem('system_active_theme', themeId);
        this.activeThemeId.set(themeId);
        this.applyThemeToDOM(theme);
      } else {
        console.warn(`[ThemeService] El tema '${themeId}' no existe en el catálogo THEMES.`);
      }
    }
  }

  /**
   * Extrae la lógica de inyección de variables CSS para reutilizarla.
   */
  private applyThemeToDOM(theme: ThemeDefinition): void {
    const root = document.documentElement;
    
    // Inject Colors
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-logo', theme.colors.logo || '');
    
    // Inject Semantic Colors
    root.style.setProperty('--theme-success', theme.colors.success);
    root.style.setProperty('--theme-warning', theme.colors.warning);
    root.style.setProperty('--theme-danger', theme.colors.danger);
    root.style.setProperty('--theme-info', theme.colors.info);
    
    // Inject Typography Sizes
    root.style.setProperty('--theme-title-size', theme.typography.titleSize);
    root.style.setProperty('--theme-subtitle-size', theme.typography.subtitleSize);
    root.style.setProperty('--theme-normal-size', theme.typography.normalSize);
    root.style.setProperty('--theme-button-size', theme.typography.buttonSize);
  }

}
