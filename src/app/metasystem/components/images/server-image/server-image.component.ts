import { Component, input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartImageComponent, ImageShape, ForceTheme } from '../smart-image/smart-image.component';
import { ApiRouteService } from '@app/core/api/api-route.service';
import { IconComponent } from '@system-shared/common/icon/icon.component';

@Component({
  selector: 'server-image',
  standalone: true,
  imports: [CommonModule, SmartImageComponent, IconComponent],
  template: `
    @if (cookedUrl()) {
      <smart-image
        [src]="cookedUrl()"
        [alt]="alt()"
        [shape]="shape()"
        [forceTheme]="forceTheme()"
        [width]="width()"
        [height]="height()"
        [imgClass]="imgClass()"
        [marco]="marco()"
        [css_marco]="css_marco()"
        (imgError)="handleError()"
      ></smart-image>
    } @else {
      @if (fallbackName()) {
        <smart-image
          [name]="fallbackName()"
          [alt]="alt()"
          [shape]="shape()"
          [forceTheme]="forceTheme()"
          [width]="width()"
          [height]="height()"
          [imgClass]="imgClass()"
          [marco]="marco()"
          [css_marco]="css_marco()"
        ></smart-image>
      } @else if (fallbackIcon()) {
        <div class="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
          <icon [icon]="fallbackIcon()!" class="w-full h-full text-gray-400 p-2"></icon>
        </div>
      }
    }
  `
})
export class ServerImageComponent {
  endpointKey = input.required<string>();
  routeKey = input.required<string>();
  params = input<Record<string, any>>();
  timestamp = input<boolean>(true); // Forzar recarga por defecto agregando ?t=...
  reloadTrigger = input<any>(); // Cambiar este valor forzará el recálculo
  fallbackName = input<string>(); // If error, fallback to ImageDictionary name
  fallbackIcon = input<string>(); // If error, fallback to Icon name
  
  // Inputs delegados a smart-image
  alt = input<string>('image');
  shape = input<ImageShape>('square');
  forceTheme = input<ForceTheme>('auto');
  width = input<number | string | undefined>(undefined);
  height = input<number | string | undefined>(undefined);
  imgClass = input<string>('');
  marco = input<boolean>(false);
  css_marco = input<string>('p-4 rounded-[2rem] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-black/50');

  private apiRouteService = inject(ApiRouteService);
  
  // Control de error
  hasError = signal<boolean>(false);

  cookedUrl = computed(() => {
    // Escuchar el reloadTrigger para forzar recálculo
    this.reloadTrigger();
    
    // Si ya hubo un error de carga, retornamos undefined para forzar el name/fallback interno de smart-image
    if (this.hasError()) return undefined;
    
    // Prevenir peticiones erróneas si falta algún parámetro obligatorio (ej. id: undefined)
    const p = this.params();
    if (p) {
      for (const key of Object.keys(p)) {
        if (p[key] === undefined || p[key] === null || p[key] === '') {
           return undefined;
        }
      }
    }

    try {
      const routeUrl = this.apiRouteService.getSpecialRoute(this.endpointKey(), this.routeKey(), this.params());
      const absoluteUrl = this.apiRouteService.getAbsoluteUrl(routeUrl);
      
      if (this.timestamp()) {
        const ts = new Date().getTime();
        return `${absoluteUrl}?t=${ts}`;
      }
      return absoluteUrl;
    } catch (error) {
      console.warn('ServerImageComponent: Error building URL', error);
      return undefined;
    }
  });

  handleError() {
    this.hasError.set(true);
  }
}
